import { Middleware } from '@reduxjs/toolkit';
import * as api from '@/lib/api';

export const apiSyncMiddleware: Middleware = store => next => action => {
  // Let the store handle the action first so state is updated
  const result = next(action);
  
  const actionType = (action as any).type;
  const payload = (action as any).payload;

  // Run backend database updates in background
  switch (actionType) {
    case 'dashboard/addTicket': {
      const state = store.getState() as any;
      const newTicket = state.dashboard.tickets[0]; // the newly added ticket at start of array
      if (newTicket) {
        api.addTicketApi(newTicket);
      }
      break;
    }
    case 'dashboard/addTicketMessage':
      api.addTicketMessageApi(payload);
      break;
    case 'dashboard/updateTicketStatus':
      api.updateTicketStatusApi(payload.ticketId, payload.status);
      break;
    case 'dashboard/approveQuotation':
      api.updateQuotationStatusApi(payload, 'APPROVED');
      break;
    case 'dashboard/declineQuotation':
      api.updateQuotationStatusApi(payload, 'DECLINED');
      break;
    case 'dashboard/addQuotation': {
      const state = store.getState() as any;
      const newQuote = state.dashboard.quotations[0];
      if (newQuote) {
        api.addQuotationApi(newQuote);
      }
      break;
    }
    case 'dashboard/addOrder': {
      const state = store.getState() as any;
      const newOrder = state.dashboard.orders[0];
      if (newOrder) {
        api.addOrderApi(newOrder);
      }
      break;
    }
    case 'dashboard/updateOrder':
      api.updateOrderStatusApi(payload.orderId, payload.status);
      break;
    case 'dashboard/addProject': {
      const state = store.getState() as any;
      const newProject = state.dashboard.projects[0];
      if (newProject) {
        api.addProjectApi(newProject);
      }
      break;
    }
    case 'dashboard/updateProjectStatus':
      api.updateProjectStatusApi(payload.projectId, payload.status, payload.progress, payload.milestones);
      break;
    case 'dashboard/addProduct':
      api.addProductApi(payload);
      break;
    case 'dashboard/updateProduct':
      api.updateProductApi(payload);
      break;
    case 'dashboard/deleteProduct':
      api.deleteProductApi(payload);
      break;
    case 'dashboard/updateUserStatus':
      api.updateUserStatusApi(payload.userId, payload.status);
      break;
    case 'dashboard/readNotifications':
      api.readNotificationsApi();
      break;
    case 'auth/updateProfile': {
      const state = store.getState() as any;
      const user = state.auth.user;
      if (user) {
        api.updateProfileApi(user.id, payload);
      }
      break;
    }
  }

  return result;
};
