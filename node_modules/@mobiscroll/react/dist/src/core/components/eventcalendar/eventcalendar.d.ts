import { BaseComponent } from '../../base';
import { MbscPrintConfig } from '../../print';
import { MbscCalendarDayData } from '../../shared/calendar-view/calendar-day';
import { CalendarViewBase, ICalendarProps, IPageChangeEvent, IPageLoadedEvent, IPageLoadingEvent, MbscCalendarLabel, MbscCalendarMarked } from '../../shared/calendar-view/calendar-view';
import { ILabelDragData, ILabelDragDataSet, MbscCalendarEvent, MbscCalendarEventData, MbscResource } from '../../shared/calendar-view/calendar-view.types';
import { DateType, formatDate, IDatetimeProps, parseDate } from '../../util/datetime';
import { updateRecurringEvent } from '../../util/recurrence';
export { getJson } from '../../util/http';
export { formatDate, parseDate, updateRecurringEvent };
export * from '../../util/luxon';
export * from '../../util/moment';
export * from '../../shared/calendar-view/calendar-view.types';
export interface IScheduleTimezone {
    cssClass?: string;
    label: string;
    timezone: string;
}
export interface MbscSelectedDateChangeEvent {
    date: DateType;
}
export interface MbscCellClickEvent {
    date: Date;
    domEvent: any;
    events: MbscCalendarEvent[];
    resource: number | string;
    selected: boolean;
    source: 'calendar' | 'schedule' | 'timeline';
    target: HTMLElement;
}
export interface MbscCellHoverEvent {
    date: Date;
    domEvent: any;
    events: MbscCalendarEvent[];
    labels: MbscCalendarLabel[];
    marked: MbscCalendarMarked[];
    selected: boolean;
    target: HTMLElement;
}
export interface MbscEventClickEvent {
    date: Date;
    domEvent: any;
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
    resource: number | string;
    source: 'agenda' | 'calendar' | 'popover' | 'schedule' | 'timeline';
}
export interface MbscEventDeleteEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
    target?: HTMLElement;
}
export interface MbscEventDeletedEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventCreateEvent {
    action: 'click' | 'drag' | 'externalDrop';
    domEvent: any;
    event: MbscCalendarEvent;
    originEvent: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventCreatedEvent {
    action: 'click' | 'drag' | 'externalDrop';
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
    target?: HTMLElement;
}
export interface MbscEventUpdateEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    newEvent: MbscCalendarEvent;
    oldEvent: MbscCalendarEvent;
    oldEventOccurrence: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventUpdatedEvent {
    event: MbscCalendarEvent;
    oldEvent: MbscCalendarEvent;
    inst: EventcalendarBase;
    source: 'calendar' | 'schedule' | 'timeline';
    target?: HTMLElement;
}
export interface MbscLabelClickEvent {
    date: Date;
    domEvent: any;
    label: MbscCalendarLabel;
    labels: MbscCalendarLabel[];
    event: MbscCalendarEvent;
    inst: EventcalendarBase;
}
export interface MbscNewEventData {
    resource?: string | number;
    slot?: string | number;
    start: Date;
}
export interface MbscPageChangeEvent {
    firstDay: Date;
    lastDay: Date;
    month?: Date;
    inst: EventcalendarBase;
}
export interface MbscPageLoadingEvent {
    firstDay: Date;
    lastDay: Date;
    month?: Date;
    inst: EventcalendarBase;
}
export interface MbscPageLoadedEvent {
    firstDay: Date;
    lastDay: Date;
    month?: Date;
    inst: EventcalendarBase;
}
export interface MbscEventUpdateFailedEvent {
    event: MbscCalendarEvent;
    newEvent: MbscCalendarEvent;
    oldEvent: MbscCalendarEvent;
    oldEventOccurrence: MbscCalendarEvent;
    inst: EventcalendarBase;
    invalid: MbscCalendarEvent;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventCreateFailedEvent {
    action: 'click' | 'drag' | 'externalDrop';
    event: MbscCalendarEvent;
    originEvent: MbscCalendarEvent;
    inst: EventcalendarBase;
    invalid: MbscCalendarEvent;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventDragEvent {
    domEvent: any;
    event: MbscCalendarEvent;
    resource?: number | string;
    slot?: number | string;
    source: 'calendar' | 'schedule' | 'timeline';
}
export interface MbscEventcalendarView {
    agenda?: {
        type?: 'day' | 'week' | 'month' | 'year';
        scrollable?: boolean;
        size?: number;
    };
    calendar?: {
        count?: boolean;
        labels?: boolean | 'all' | number;
        outerDays?: boolean;
        popover?: boolean;
        popoverClass?: string;
        scroll?: 'horizontal' | 'vertical';
        size?: number;
        type?: 'year' | 'month' | 'week';
        weekNumbers?: boolean;
    };
    schedule?: {
        endDay?: number;
        endTime?: string;
        size?: number;
        startDay?: number;
        startTime?: string;
        type?: 'day' | 'week' | 'month';
        days?: boolean;
        allDay?: boolean;
        timeCellStep?: number;
        timeLabelStep?: number;
        timezones?: Array<IScheduleTimezone | string>;
    };
    timeline?: {
        endDay?: number;
        endTime?: string;
        eventList?: boolean;
        rowHeight?: 'variable' | 'equal';
        size?: number;
        startDay?: number;
        startTime?: string;
        type?: 'day' | 'week' | 'month' | 'year';
        timeCellStep?: number;
        timeLabelStep?: number;
        days?: boolean;
        allDay?: boolean;
        weekNumbers?: boolean;
    };
}
export interface MbscEventcalendarOptions extends ICalendarProps {
    actionableEvents?: boolean;
    chevronIconDown?: string;
    clickToCreate?: boolean | 'double' | 'single';
    colorEventList?: boolean;
    data?: MbscCalendarEvent[];
    dragTimeStep?: number;
    dragToCreate?: boolean;
    dragToMove?: boolean;
    dragToResize?: boolean;
    defaultSelectedDate?: DateType;
    eventDelete?: boolean;
    eventOrder?: (event1: MbscCalendarEvent, event2: MbscCalendarEvent) => number;
    /** @hidden */
    eventTemplate?: any;
    extendDefaultEvent?: (args: MbscNewEventData) => MbscCalendarEvent;
    externalDrop?: boolean;
    groupBy?: 'date' | 'resource';
    invalidateEvent?: 'start-end' | 'strict';
    refDate?: DateType;
    resources?: MbscResource[] | null | undefined;
    selectedDate?: DateType;
    slots?: MbscSlot[] | null | undefined;
    showEventTooltip?: boolean;
    view?: MbscEventcalendarView;
    allDayText?: string;
    newEventText?: string;
    noEventsText?: string;
    toText?: string;
    renderAgenda?(events: MbscEventList[], options: MbscEventcalendarOptions, dayRefs: {
        [key: number]: HTMLElement | null;
    }): any;
    renderDay?(args: MbscCalendarDayData): any;
    renderDayContent?(args: MbscCalendarDayData): any;
    renderEvent?(data: MbscCalendarEventData): any;
    renderEventContent?(data: MbscCalendarEventData): any;
    renderHeader?(): any;
    renderLabel?(event: MbscCalendarEventData): any;
    renderLabelContent?(event: MbscCalendarEventData): any;
    renderResource?(resource: MbscResource): any;
    renderResourceHeader?(): any;
    renderSlot?(args: MbscSlotData): any;
    renderScheduleEvent?(event: MbscCalendarEventData): any;
    renderScheduleEventContent?(event: MbscCalendarEventData): any;
    onCellClick?(args: MbscCellClickEvent, inst: EventcalendarBase): void;
    onCellDoubleClick?(args: MbscCellClickEvent, inst: EventcalendarBase): void;
    onCellHoverIn?(args: MbscCellHoverEvent, inst: EventcalendarBase): void;
    onCellHoverOut?(args: MbscCellHoverEvent, inst: EventcalendarBase): void;
    onCellRightClick?(args: MbscCellClickEvent, inst: EventcalendarBase): void;
    onEventClick?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventCreate?(args: MbscEventCreateEvent, inst: EventcalendarBase): void;
    onEventCreated?(args: MbscEventCreatedEvent, inst: EventcalendarBase): void;
    onEventDelete?(args: MbscEventDeleteEvent, inst: EventcalendarBase): void;
    onEventDeleted?(args: MbscEventDeletedEvent, inst: EventcalendarBase): void;
    onEventDoubleClick?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventDragEnd?(args: MbscEventDragEvent, inst: EventcalendarBase): void;
    onEventDragStart?(args: MbscEventDragEvent, inst: EventcalendarBase): void;
    onEventRightClick?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventHoverIn?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventHoverOut?(args: MbscEventClickEvent, inst: EventcalendarBase): void;
    onEventUpdate?(args: MbscEventUpdateEvent, inst: EventcalendarBase): void;
    onEventUpdated?(args: MbscEventUpdatedEvent, inst: EventcalendarBase): void;
    onEventUpdateFailed?(args: MbscEventUpdateFailedEvent, inst: EventcalendarBase): void;
    onEventCreateFailed?(args: MbscEventCreateFailedEvent, inst: EventcalendarBase): void;
    onLabelClick?(args: MbscLabelClickEvent, inst: EventcalendarBase): void;
    onPageChange?(args: MbscPageChangeEvent, inst: EventcalendarBase): void;
    onPageLoading?(args: MbscPageLoadingEvent, inst: EventcalendarBase): void;
    onPageLoaded?(args: MbscPageLoadedEvent, inst: EventcalendarBase): void;
    onSelectedDateChange?(args: MbscSelectedDateChangeEvent, inst: EventcalendarBase): void;
}
/** @hidden */
export interface MbscEventcalendarState {
    activeDate?: number;
    eventList?: MbscEventList[];
    height?: number;
    isListScrollable?: boolean;
    isTouchDrag?: boolean;
    popoverDate?: number | undefined;
    popoverList?: MbscCalendarEventData[];
    selectedDate?: number;
    showPopover?: boolean;
    labelDragData?: ILabelDragData;
    width?: number;
}
export interface MbscEventList {
    date: string;
    events: MbscCalendarEventData[];
    timestamp: number;
}
export interface MbscSlot {
    id: number | string;
    name?: string;
    color?: string;
    [x: string]: any;
}
export interface MbscSlotData {
    date: Date;
    slot: MbscSlot;
}
/** @hidden */
export declare function getDataInRange(data: any[], s: MbscEventcalendarOptions, firstDay: Date, lastDay: Date, start?: DateType, end?: DateType): MbscCalendarEvent[];
/** @hidden */
export declare function getEventId(): string;
/** @hidden */
export declare function getEventData(s: IDatetimeProps, event: MbscCalendarEvent, eventDay: number, colorEvent: boolean, timeFormat: string, allDayText: string, toText: string, resource?: MbscResource, isList?: boolean, isTimeline?: boolean): MbscCalendarEventData;
/** @hidden */
export declare class EventcalendarBase extends BaseComponent<MbscEventcalendarOptions, MbscEventcalendarState> {
    /** @hidden */
    static defaults: MbscEventcalendarOptions;
    protected static _name: string;
    state: MbscEventcalendarState;
    eventList: MbscEventList[] | undefined;
    print: (config?: MbscPrintConfig) => void;
    /** @hidden */
    _active: number;
    /** @hidden */
    _anchor: HTMLDivElement;
    /** @hidden */
    _calendarScroll: 'horizontal' | 'vertical' | undefined;
    /** @hidden */
    _calendarSize: number;
    /** @hidden */
    _calendarLabelList: 'all' | number | boolean | undefined;
    /** @hidden */
    _calendarType: 'year' | 'month' | 'week';
    /** @hidden */
    _calendarView: CalendarViewBase;
    /** @hidden */
    _colorEventList: boolean;
    /** @hidden */
    _colorsMap: {
        [key: number]: MbscCalendarEvent[];
    } | undefined;
    /** @hidden */
    _cssClass: string;
    /** @hidden */
    _eventListType: 'year' | 'month' | 'week' | 'day';
    /** @hidden */
    _eventListSize: number;
    /** @hidden */
    _eventMap: {
        [key: string]: MbscCalendarEvent[];
    };
    /** @hidden */
    _invalidsMap: {
        [key: number]: MbscCalendarEvent[];
    } | undefined;
    /** @hidden */
    _list: HTMLElement | null;
    /** @hidden */
    _listDays: {
        [key: number]: HTMLElement | null;
    } | null;
    /** @hidden */
    _maxDate: number;
    /** @hidden */
    _minDate: number;
    /** @hidden */
    _pageLoad: number;
    /** @hidden */
    _popoverClass: string;
    /** @hidden */
    _rangeEndDay: number | undefined;
    /** @hidden */
    _rangeStartDay: number | undefined;
    /** @hidden */
    _rangeType: 'year' | 'month' | 'week' | 'day';
    /** @hidden */
    _refDate: Date;
    /** @hidden */
    _resourcesMap: {
        [key: number]: MbscResource;
    };
    /** @hidden */
    _scheduleType: 'month' | 'week' | 'day';
    /** @hidden */
    _scheduleEndDay: number;
    /** @hidden */
    _scheduleStartDay: number;
    /** @hidden */
    _scheduleEndTime: string | undefined;
    /** @hidden */
    _scheduleSize: number;
    /** @hidden */
    _scheduleStartTime: string | undefined;
    /** @hidden */
    _scheduleTimeCellStep: number;
    /** @hidden */
    _scheduleTimeLabelStep: number;
    /** @hidden */
    _scheduleTimezones: Array<IScheduleTimezone | string> | undefined;
    /** @hidden */
    _timelineSize: number;
    /** @hidden */
    _timelineType: 'year' | 'month' | 'week' | 'day';
    /** @hidden */
    _timelineEndDay: number;
    /** @hidden */
    _timelineStartDay: number;
    /** @hidden */
    _timelineEndTime: string | undefined;
    /** @hidden */
    _timelineStartTime: string | undefined;
    /** @hidden */
    _timelineRowHeight: 'variable' | 'equal' | undefined;
    /** @hidden */
    _timelineTimeCellStep: number;
    /** @hidden */
    _timelineTimeLabelStep: number;
    /** @hidden */
    _timelineListing: boolean | undefined;
    /** @hidden */
    _selected: number;
    /** @hidden */
    _selectedDateHeader: string;
    /** @hidden */
    _selectedDates: {
        [key: number]: boolean;
    };
    /** @hidden */
    _selectedDateTime: number;
    /** @hidden */
    _shouldScrollSchedule: number;
    /** @hidden */
    _showCalendar: boolean | undefined;
    /** @hidden */
    _showDate: boolean | undefined;
    /** @hidden */
    _showEventCount: boolean | undefined;
    /** @hidden */
    _showEventLabels: boolean | undefined;
    /** @hidden */
    _showEventList: boolean | undefined;
    /** @hidden */
    _showEventPopover: boolean | undefined;
    /** @hidden */
    _showOuterDays: boolean | undefined;
    /** @hidden */
    _showSchedule: boolean | undefined;
    /** @hidden */
    _showScheduleAllDay: boolean | undefined;
    /** @hidden */
    _showScheduleDays: boolean | undefined;
    /** @hidden */
    _showTimeline: boolean | undefined;
    /** @hidden */
    _showTimelineWeekNumbers: boolean | undefined;
    /** @hidden */
    _showWeekNumbers: boolean | undefined;
    /** @hidden */
    _rowTops: number[];
    /** @hidden */
    _update: number;
    /** @hidden */
    _validsMap: {
        [key: number]: MbscCalendarEvent[];
    } | undefined;
    _firstDay: Date;
    _firstWeekDay: number;
    _lastDay: Date;
    /** @hidden */
    _onScroll: (...args: any[]) => void;
    protected _eventListHTML: any;
    protected _popoverList?: HTMLElement;
    protected _shouldLoadDays: boolean;
    private _tempDay;
    private _tempWeek;
    private _tempEvent;
    private _calCellWidth;
    private _areaTop;
    private _areaLeft;
    private _areaBottom;
    private _areaRight;
    private _onCalendar;
    private _triggerCreated;
    private _triggerUpdated;
    private _triggerDeleted;
    private _defaultDate;
    private _events;
    private _hoverTimer;
    private _isHover;
    private _isListScrolling;
    private _isPageChange;
    private _moreLabelClicked;
    private _refresh;
    private _shouldAnimateScroll;
    private _shouldScroll;
    private _shouldSkipScroll;
    private _skipScheduleScroll;
    private _unsubscribe;
    private _viewChanged;
    /**
     * Sets the events for the calendar.
     * @param events Array containing the events.
     */
    addEvent(events: MbscCalendarEvent | MbscCalendarEvent[]): string[];
    /**
     * Returns the events between start/end.
     */
    getEvents(start?: DateType, end?: DateType): MbscCalendarEvent[];
    /**
     * Returns the invalids between start/end.
     */
    getInvalids(start?: DateType, end?: DateType): MbscCalendarEvent[];
    /**
     * Sets the events for the calendar.
     * @param events Array containing the events.
     */
    setEvents(events: MbscCalendarEvent[]): string[];
    /**
     * Removes one or more events from the calendar.
     * @param events
     */
    removeEvent(events: string | number | MbscCalendarEvent | string[] | number[] | MbscCalendarEvent[]): void;
    /**
     * Navigates the calendar to the specified date.
     * @param date
     */
    navigate(date: DateType, animate?: boolean): void;
    /**
     * Updates one or more events in the calendar.
     * @param events
     */
    updateEvent(events: MbscCalendarEvent | MbscCalendarEvent[]): void;
    /**
     * Refreshes the view.
     */
    refresh(): void;
    /** @hidden */
    _isToday(d: number): boolean;
    /** @hidden */
    _onWeekDayClick: (d: number) => void;
    /** @hidden */
    _onDayClick: (args: any) => void;
    /** @hidden */
    _onActiveChange: (args: any) => void;
    /** @hidden */
    _onGestureStart: (args: any) => void;
    /** @hidden */
    _onDayDoubleClick: (args: any) => void;
    /** @hidden */
    _onDayRightClick: (args: any) => void;
    /** @hidden */
    _onCellHoverIn: (args: any) => void;
    /** @hidden */
    _onCellHoverOut: (args: any) => void;
    /** @hidden */
    _onEventHoverIn: (args: any) => void;
    /** @hidden */
    _onEventHoverOut: (args: any) => void;
    /** @hidden */
    _onEventClick: (args: any) => void;
    /** @hidden */
    _onEventDoubleClick: (args: any) => void;
    /** @hidden */
    _onEventRightClick: (args: any) => void;
    /** @hidden */
    _onEventDragEnd: (args: any) => void;
    /** @hidden */
    _onEventDragStart: (args: any) => void;
    /** @hidden */
    _onLabelHoverIn: (args: any) => void;
    /** @hidden */
    _onLabelHoverOut: (args: any) => void;
    /** @hidden */
    _onLabelClick: (args: any) => void;
    /** @hidden */
    _onLabelDoubleClick: (args: any) => void;
    /** @hidden */
    _onLabelRightClick: (args: any) => void;
    /** @hidden */
    _onCellClick: (args: any) => void;
    /** @hidden */
    _onCellDoubleClick: (args: any) => void;
    /** @hidden */
    _onCellRightClick: (args: any) => void;
    /** @hidden */
    _onPageChange: (args: IPageChangeEvent) => void;
    /** @hidden */
    _onPageLoading: (args: IPageLoadingEvent) => void;
    /** @hidden */
    _onPageLoaded: (args: IPageLoadedEvent) => void;
    /** @hidden */
    _onPopoverClose: () => void;
    /** @hidden */
    _onResize: (ev: any) => void;
    /** @hidden */
    _getDragDates: (start: Date, end: Date, event: MbscCalendarEventData) => {
        [key: number]: ILabelDragDataSet;
    };
    _onLabelUpdateModeOn: (args: any) => void;
    _onLabelUpdateModeOff: (args: any) => void;
    _onLabelUpdateStart: (args: any) => void;
    _onLabelUpdateMove: (args: any) => void;
    _onLabelUpdateEnd: (args: any) => void;
    _onEventDragStop: (args: any) => boolean;
    _onExternalDrag: (args: any) => void;
    /** @hidden */
    _onEventDelete: (args: any) => void;
    protected _render(s: MbscEventcalendarOptions, state: MbscEventcalendarState): void;
    protected _mounted(): void;
    protected _updated(): void;
    protected _destroy(): void;
    private _getAgendaEvents;
    private _getEventData;
    /**
     * Returns the timestamp of the closest day which falls between the specified start and end weekdays.
     * @param timestamp The timestamp of the date to validate.
     * @param dir Navigation direction. If not specified, it will return the next valid day, otherwise the next or prev, based on direction.
     */
    private _getValidDay;
    private _setEventList;
    private _hidePopover;
    private _scrollToDay;
    private _selectedChange;
    private _cellClick;
    private _dayClick;
    private _labelClick;
    private _eventClick;
}
