// Notify handler
import { notifyHandlerActions } from '../../../lib/notify-handler';
export const { CATCH_NOTIFY_HANDLER } = notifyHandlerActions;

// Auth
export const START_LOGIN = 'START_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const START_LOGOUT = 'START_LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export const START_CHECK_AUTH = 'START_CHECK_AUTH';
export const CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS';
export const CHECK_AUTH_FAILED = 'CHECK_AUTH_FAILED';

// Users
export const START_FETCH_USERS = 'START_FETCH_USERS';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILED = 'FETCH_USERS_FAILED';

export const START_CREATE_MANAGER = 'START_CREATE_MANAGER';
export const CREATE_MANAGER_SUCCESS = 'CREATE_MANAGER_SUCCESS';
export const CREATE_MANAGER_FAILED = 'CREATE_MANAGER_FAILED';

export const START_CREATE_STAFF = 'START_CREATE_STAFF';
export const CREATE_STAFF_SUCCESS = 'CREATE_STAFF_SUCCESS';
export const CREATE_STAFF_FAILED = 'CREATE_STAFF_FAILED';

export const START_UPDATE_MANAGER = 'START_UPDATE_MANAGER';
export const UPDATE_MANAGER_SUCCESS = 'UPDATE_MANAGER_SUCCESS';
export const UPDATE_MANAGER_FAILED = 'UPDATE_MANAGER_FAILED';

export const START_UPDATE_STAFF = 'START_UPDATE_STAFF';
export const UPDATE_STAFF_SUCCESS = 'UPDATE_STAFF_SUCCESS';
export const UPDATE_STAFF_FAILED = 'UPDATE_STAFF_FAILED';

export const START_DELETE_USER = 'START_DELETE_USER';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILED = 'DELETE_USER_FAILED';

// Channels
export const START_FETCH_CHANNELS = 'START_FETCH_CHANNELS';
export const FETCH_CHANNELS_SUCCESS = 'FETCH_CHANNELS_SUCCESS';
export const FETCH_CHANNELS_FAILED = 'FETCH_CHANNELS_FAILED';

export const START_CREATE_CHANNEL = 'START_CREATE_CHANNEL';
export const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
export const CREATE_CHANNEL_FAILED = 'CREATE_CHANNEL_FAILED';

export const START_UPDATE_CHANNEL = 'START_UPDATE_CHANNEL';
export const UPDATE_CHANNEL_SUCCESS = 'UPDATE_CHANNEL_SUCCESS';
export const UPDATE_CHANNEL_FAILED = 'UPDATE_CHANNEL_FAILED';

export const START_DELETE_CHANNEL = 'START_DELETE_CHANNEL';
export const DELETE_CHANNEL_SUCCESS = 'DELETE_CHANNEL_SUCCESS';
export const DELETE_CHANNEL_FAILED = 'DELETE_CHANNEL_FAILED';

export const START_FETCH_CHANNEL_OPTIONS = 'START_FETCH_CHANNEL_OPTIONS';
export const FETCH_CHANNEL_OPTIONS_SUCCESS = 'FETCH_CHANNEL_OPTIONS_SUCCESS';
export const FETCH_CHANNEL_OPTIONS_FAILED = 'FETCH_CHANNEL_OPTIONS_FAILED';

// Tags
export const START_FETCH_TAGS = 'START_FETCH_TAGS';
export const FETCH_TAGS_SUCCESS = 'FETCH_TAGS_SUCCESS';
export const FETCH_TAGS_FAILED = 'FETCH_TAGS_FAILED';

export const START_CREATE_TAG = 'START_CREATE_TAG';
export const CREATE_TAG_SUCCESS = 'CREATE_TAG_SUCCESS';
export const CREATE_TAG_FAILED = 'CREATE_TAG_FAILED';

export const START_UPDATE_TAG = 'START_UPDATE_TAG';
export const UPDATE_TAG_SUCCESS = 'UPDATE_TAG_SUCCESS';
export const UPDATE_TAG_FAILED = 'UPDATE_TAG_FAILED';

export const START_DELETE_TAG = 'START_DELETE_TAG';
export const DELETE_TAG_SUCCESS = 'DELETE_TAG_SUCCESS';
export const DELETE_TAG_FAILED = 'DELETE_TAG_FAILED';

// Orders
export const START_FETCH_ORDERS = 'START_FETCH_ORDERS';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILED = 'FETCH_ORDERS_FAILED';

// Order and comment
export const START_FETCH_ORDER = 'START_FETCH_ORDER';
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
export const FETCH_ORDER_FAILED = 'FETCH_ORDER_FAILED';

export const START_FETCH_ORDER_COMMENTS = 'START_FETCH_ORDER_COMMENTS';
export const FETCH_ORDER_COMMENTS_SUCCESS = 'FETCH_ORDER_COMMENTS_SUCCESS';
export const FETCH_ORDER_COMMENTS_FAILED = 'FETCH_ORDER_COMMENTS_FAILED';

// Log
export const START_FETCH_ORDER_LOGS = 'START_FETCH_ORDER_LOGS';
export const FETCH_ORDER_LOGS_SUCCESS = 'FETCH_ORDER_LOGS_SUCCESS';
export const FETCH_ORDER_LOGS_FAILED = 'FETCH_ORDER_LOGS_FAILED';
