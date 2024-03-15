import { useEffect, useRef, useState } from "react";
import ChannelIOService, { Settings } from "../service/ChannelIOService";

interface ChannelUserInfo extends Omit<Settings, "pluginKey"> {}

const CHANNEL_USER_INFO_DEFAULT: ChannelUserInfo = {
    memberId: "",
    profile: {
        name: "",
        mobileNumber: "",
    },
};

interface UseChannelIOProps {
    pluginKey: string;
}

const UseChannelIO = ({ pluginKey }: UseChannelIOProps) => {
    const [isBooted, setIsBooted] = useState<boolean>(false);
    const channelUserInfoRef = useRef<ChannelUserInfo>();
    const channelIOServiceRef = useRef<ChannelIOService>();
    const onShowMessengerEventListenerRef = useRef<() => void>();

    const addShowMessengerEventListener = (onShowMessenger: () => void) => {
        onShowMessengerEventListenerRef.current = onShowMessenger;
        channelIOServiceRef.current?.addShowMessengerEventListener(onShowMessenger);
    };

    const removeAllEventListener = () => {
        onShowMessengerEventListenerRef.current = undefined;
        channelIOServiceRef.current?.removeAllEventListener();
    };

    useEffect(() => {
        if (!channelIOServiceRef.current) {
            channelIOServiceRef.current = new ChannelIOService();
        }
        if (isBooted) {
            const settings = {
                pluginKey,
                ...CHANNEL_USER_INFO_DEFAULT,
                ...(channelUserInfoRef.current ?? {}),
            };
            channelIOServiceRef.current?.boot(settings, () => {
                if (onShowMessengerEventListenerRef.current) {
                    addShowMessengerEventListener(onShowMessengerEventListenerRef.current);
                }
            });
        } else {
            removeAllEventListener();
            channelIOServiceRef.current?.shutdown();
        }
        return () => {
            if (isBooted) {
                removeAllEventListener();
                channelIOServiceRef.current?.shutdown();
            }
        };
    }, [isBooted]);
    const boot = (userInfo?: ChannelUserInfo) => {
        if (isBooted) {
            return;
        }

        if (!pluginKey) {
            console.error("PluginKey is required to init ChannelIO!");
            return;
        }
        channelUserInfoRef.current = userInfo;
        setIsBooted(true);
    };
    const shutdown = () => {
        channelIOServiceRef.current?.removeAllEventListener();
        setIsBooted(false);
    };

    return {
        isBooted,
        boot,
        shutdown,
        addShowMessengerEventListener,
        removeAllEventListener,
    };
};

export default UseChannelIO;
