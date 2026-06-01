/**
 * Service Layer Index
 * Centralizes all functional ESM service namespace re-exports.
 */

import * as authService from './auth.service.js';
import * as workspaceService from './workspace.service.js';
import * as channelService from './channel.service.js';
import * as messageService from './message.service.js';
import * as callService from './call.service.js';
import * as fileService from './file.service.js';
import * as directMessageService from './directMessage.service.js';
import * as searchService from './search.service.js';
import * as notificationService from './notification.service.js';
import * as adminService from './admin.service.js';

export {
  authService,
  workspaceService,
  channelService,
  messageService,
  callService,
  fileService,
  directMessageService,
  searchService,
  notificationService,
  adminService,
};
