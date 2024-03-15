import { MbscCalendarLabel } from './calendar-view';
export interface ILabelDragDataSet {
    event?: MbscCalendarLabel;
    width?: number;
}
export interface MbscResource {
    id: number | string;
    name?: string;
    collapsed?: boolean;
    color?: string;
    [x: string]: any;
    children?: Array<{
        id: number | string;
        name?: string;
        collapsed?: boolean;
        color?: string;
        [x: string]: any;
    }>;
}
export interface MbscCalendarEvent extends MbscCalendarLabel {
    /** Specifies if the event is all day or not. */
    allDay?: boolean;
    /** A unique id for the event. If not specifed, the event will get a generated id. */
    id?: string | number;
    /** Resource or resources of the event. */
    resource?: number | string | Array<number | string>;
    slot?: number | string;
    /** The title of the event. */
    title?: string;
    tooltip?: string;
}
export interface ILabelDragData {
    /**
     * The dates of the event which is dragged.
     * We need to display the event boxes in case of touch drag, when we enter drag mode,
     * and continue to display during drag, but invisible, otherwise, if we loose the
     * element on which the touch started, the touch events will stop firing.
     */
    originDates?: {
        [key: string]: ILabelDragDataSet;
    };
    /** The dates of the dragged event. Only containing the start of the event on every week and the
     * width of the event on that week
     */
    draggedDates?: {
        [key: string]: ILabelDragDataSet;
    };
    /** The dragged event, displayed during drag. */
    draggedEvent?: MbscCalendarEvent;
}
export interface MbscCalendarEventData {
    allDay?: boolean;
    allDayText?: string;
    color?: string;
    cssClass?: string;
    currentResource?: MbscResource;
    date: number;
    end?: string;
    endDate: Date;
    html?: any;
    id?: any;
    isMultiDay?: boolean;
    lastDay?: string;
    original?: MbscCalendarEvent;
    position?: any;
    resource?: number | string | Array<number | string>;
    showText?: boolean;
    slot?: number | string;
    start?: string;
    startDate: Date;
    style?: any;
    title?: string;
    tooltip?: string;
    uid?: string;
}
