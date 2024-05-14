export const isDebug = process.env.NODE_ENV === 'development';

const MEGABYTE_SIZE = 1024 * 1024;
export const MAX_AVATAR_SIZE = 5 * MEGABYTE_SIZE;
export const MAX_ATTACH_SIZE = 30 * MEGABYTE_SIZE;

export const MIN_TAG_LENGTH = 2
export const MAX_TAG_LENGTH = 12
export const MAX_TAG_COUNT = 10