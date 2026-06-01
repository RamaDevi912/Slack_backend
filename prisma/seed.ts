import { User } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import pkg from '@prisma/client'

const { PrismaClient } = pkg
const prisma = new PrismaClient()

// Helper to hash password
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

interface DemoUser {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
}

async function main(): Promise<void> {
  console.log('🌱 Seeding database...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE')

  // Create demo users
  console.log('Creating users...')
  const users: User[] = []

  const demoUsers: DemoUser[] = [
    {
      email: 'admin@slack.com',
      username: 'admin',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
    },
    {
      email: 'john@slack.com',
      username: 'john_doe',
      password: 'User@123',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      email: 'jane@slack.com',
      username: 'jane_smith',
      password: 'User@123',
      firstName: 'Jane',
      lastName: 'Smith',
    },
    {
      email: 'bob@slack.com',
      username: 'bob_wilson',
      password: 'User@123',
      firstName: 'Bob',
      lastName: 'Wilson',
    },
  ]

  for (const demoUser of demoUsers) {
    const passwordHash = await hashPassword(demoUser.password)

    const user = await prisma.user.create({
      data: {
        email: demoUser.email,
        username: demoUser.username,
        passwordHash,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        status: 'ONLINE',
      },
    })

    await prisma.notificationSetting.create({
      data: {
        userId: user.id,
      },
    })

    users.push(user)
  }

  // Create platform admin
  console.log('Creating platform admin...')
  await prisma.platformAdmin.create({
    data: {
      userId: users[0].id,
      role: 'SUPER_ADMIN',
    },
  })

  // Create workspaces
  console.log('Creating workspaces...')
  const workspaces = []

  for (let i = 0; i < 2; i++) {
    const workspace = await prisma.workspace.create({
      data: {
        name: `${faker.word.adjective()} ${faker.word.noun()} Inc.`,
        slug: `workspace-${uuidv4().substring(0, 6)}`,
        description: faker.lorem.sentence(),
        createdBy: users[0].id,
      },
    })
    workspaces.push(workspace)
  }

  // Add members to workspaces
  console.log('Adding workspace members...')
  for (const workspace of workspaces) {
    for (const user of users) {
      await prisma.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: user.id === users[0].id ? 'OWNER' : 'MEMBER',
        },
      })
    }
  }

  // Create channels
  console.log('Creating channels...')
  const channels = []
  const channelNames = ['general', 'random', 'announcements', 'engineering', 'marketing', 'sales']

  for (const workspace of workspaces) {
    for (const channelName of channelNames) {
      const channel = await prisma.channel.create({
        data: {
          workspaceId: workspace.id,
          name: channelName,
          description: `${channelName} channel discussion`,
          isPrivate: false,
          createdBy: users[0].id,
        },
      })

      channels.push(channel)

      for (const user of users) {
        await prisma.channelMember.create({
          data: {
            channelId: channel.id,
            userId: user.id,
            role: user.id === users[0].id ? 'OWNER' : 'MEMBER',
          },
        })
      }
    }
  }

  // Create messages
  console.log('Creating messages...')
  for (const channel of channels) {
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)]

      await prisma.message.create({
        data: {
          channelId: channel.id,
          userId: user.id,
          content: faker.lorem.paragraph(),
        },
      })
    }
  }

  // Create direct messages
  console.log('Creating direct message rooms...')
  for (const workspace of workspaces) {
    const room = await prisma.directMessageRoom.create({
      data: {
        workspaceId: workspace.id,
        participantIds: [users[0].id, users[1].id],
      },
    })

    for (let i = 0; i < 5; i++) {
      const sender = i % 2 === 0 ? users[0] : users[1]
      const receiver = i % 2 === 0 ? users[1] : users[0]

      await prisma.directMessage.create({
        data: {
          roomId: room.id,
          senderId: sender.id,
          receiverId: receiver.id,
          content: faker.lorem.sentence(),
          isRead: true,
        },
      })
    }
  }

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e: unknown) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })