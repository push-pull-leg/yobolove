import { MbscCalendarSync, MbscCalendarSyncConfig } from './common';
export interface MbscGoogleCalendarSyncConfig extends MbscCalendarSyncConfig {
    apiKey?: string;
    gapi?: any;
    gis?: any;
    scopes?: string;
}
export declare const googleCalendarSync: MbscCalendarSync<MbscGoogleCalendarSyncConfig>;
