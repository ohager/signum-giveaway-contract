import {HttpError} from "@signumjs/http";

export const handleError = e => {
    if (e instanceof HttpError) {
        console.error('Oh oh, something went wrong:',
            e.message,
            e.data || '',
            e.requestUrl || ''
        )
    } else {
        console.error('Oh oh, something went wrong:', e)
    }
};
