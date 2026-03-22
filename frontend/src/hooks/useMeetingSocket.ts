import { useEffect, useRef, useCallback } from 'react';

type MeetingUpdate = {
    type: string;
    data: {
        id: number;
        ref_number: string;
        status: string;
        department: string;
        event: string;
    };
};

export function useMeetingSocket(onUpdate: (update: MeetingUpdate) => void) {
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const connect = useCallback(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/meetings/');

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onUpdate(data);
            } catch (err) {
                console.error('WebSocket message error:', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected — reconnecting in 3s');
            reconnectTimer.current = setTimeout(connect, 3000);
        };

        socket.onerror = () => {
            socket.close();
        };

        ws.current = socket;
    }, [onUpdate]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            ws.current?.close();
        };
    }, [connect]);
}