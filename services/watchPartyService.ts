
import { Peer, DataConnection } from 'peerjs';

export interface PartyMessage {
    user: string;
    text: string;
    timestamp: number;
}

export interface PlaybackState {
    isPlaying: boolean;
    currentTime: number;
    timestamp: number;
}

export interface PartyUpdate {
    type: 'PLAYBACK' | 'CHAT' | 'MEMBERS' | 'SYNC_REQUEST';
    payload: any;
}

class WatchPartyService {
    private peer: Peer | null = null;
    private connections: Map<string, DataConnection> = new Map();
    private isHost: boolean = false;
    private onUpdateCallback: ((update: PartyUpdate) => void) | null = null;

    init(userId: string, callback: (update: PartyUpdate) => void) {
        this.onUpdateCallback = callback;
        // userId should be alphanumeric for PeerJS
        const peerId = `wsp-${userId.replace(/[^a-zA-Z0-9]/g, '')}-${Math.floor(Math.random() * 1000)}`;
        this.peer = new Peer(peerId);

        this.peer.on('connection', (conn) => {
            this.handleIncomingConnection(conn);
        });

        return peerId;
    }

    private handleIncomingConnection(conn: DataConnection) {
        conn.on('open', () => {
            this.connections.set(conn.peer, conn);
            console.log(`Connection opened with: ${conn.peer}`);
            
            // If we're host, notify others or sync the new member
            if (this.isHost) {
                this.broadcastMembers();
            }
        });

        conn.on('data', (data) => {
            const update = data as PartyUpdate;
            if (this.onUpdateCallback) {
                this.onUpdateCallback(update);
            }

            // Host rebroadcasts chat messages or playback signals
            if (this.isHost && (update.type === 'CHAT' || update.type === 'PLAYBACK')) {
                this.broadcast(update, conn.peer);
            }
        });

        conn.on('close', () => {
            this.connections.delete(conn.peer);
            if (this.isHost) this.broadcastMembers();
        });
    }

    createRoom(): string {
        this.isHost = true;
        return this.peer?.id || '';
    }

    joinRoom(hostId: string) {
        if (!this.peer) return;
        this.isHost = false;
        const conn = this.peer.connect(hostId);
        this.handleIncomingConnection(conn);
    }

    broadcast(update: PartyUpdate, excludeId?: string) {
        this.connections.forEach((conn, id) => {
            if (id !== excludeId) {
                conn.send(update);
            }
        });
    }

    private broadcastMembers() {
        const members = Array.from(this.connections.keys());
        this.broadcast({
            type: 'MEMBERS',
            payload: members
        });
    }

    disconnect() {
        this.peer?.destroy();
        this.connections.clear();
        this.isHost = false;
    }
}

export const watchPartyService = new WatchPartyService();
