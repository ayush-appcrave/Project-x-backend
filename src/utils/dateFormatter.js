import { ApiError } from './ApiError.js';
import { asyncHandler } from './asyncHandler.js';

const formatDateTime = asyncHandler(
  async (mongoDate, locale = 'en-IN', timeZone = 'Asia/Kolkata') => {
    if (!mongoDate) {
      throw new ApiError(400, 'Invalid Date Input');
    }

    const date = new Date(mongoDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timeZone,
      timeZoneName: 'short',
    };

    const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

    return new ApiResponse(200, { formattedDate }, 'Date formatted successfully');
  }
);

export { formatDateTime };
