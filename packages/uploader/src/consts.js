// @flow

export const UPLOADER_EVENTS = {
	BATCH_ADD: "BATCH-ADD",
	BATCH_START: "BATCH-START",
    BATCH_PROGRESS: "BATCH_PROGRESS",
	BATCH_FINISH: "BATCH-FINISH",
	BATCH_ABORT: "BATCH-ABORT",
	BATCH_CANCEL: "BATCH-CANCEL",

	ITEM_START: "FILE-START",
	ITEM_CANCEL: "FILE-CANCEL",
	ITEM_PROGRESS: "FILE-PROGRESS",
	ITEM_FINISH: "FILE-FINISH",
	ITEM_ABORT: "FILE-ABORT",
	ITEM_ERROR: "FILE-ERROR",

	REQUEST_PRE_SEND: "REQUEST_PRE_SEND",
};

export const PROGRESS_DELAY = 100;

export const SENDER_EVENTS = {
	ITEM_PROGRESS: "ITEM_PROGRESS",
    BATCH_PROGRESS: "BATCH_PROGRESS",
};
