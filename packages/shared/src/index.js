// @flow

import invariant from "invariant";
import throttle from "just-throttle";
import { BATCH_STATES, FILE_STATES } from "./consts";
import * as logger from "./logger";
import triggerCancellable from "./triggerCancellable";
import triggerUpdater from "./triggerUpdater";
import createBatchItem from "./batchItem";

export {
    BATCH_STATES,
    FILE_STATES,

    //one source for invariant to all other packages
    invariant,

    //one source for throttle to all other packages
    throttle,

    logger,

    triggerCancellable,
    triggerUpdater,
    createBatchItem,
};

export {
    isFunction,
    isSamePropInArrays,
    devFreeze,
    merge,
    clone,
    produce,
} from "./utils";

export type {
    UploadOptions,
    CreateOptions,
    Destination,
    UploadInfo,
    ProgressInfo,
    BatchState,
    FileState,
    NonMaybeTypeFunc,
    Batch,
    BatchItem,
    SendMethod,
    SendResult,
    UploadData,
    OnProgress,
    SendOptions,
    SenderProgressEvent,
    Trigger,
    Cancellable,
    Updater,
    FileLike,
    GetExact,
    FileFilterMethod,
} from "./types";
