export interface SensorModel {
    id: string;
    pid: string;
    state: 'on' | 'off';
    fps?: number;
    timestamp: Date;
}