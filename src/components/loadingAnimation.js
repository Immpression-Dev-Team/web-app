import { useEffect, useState } from "react";

const useLoadingAnimation = (isLoading) => {
    const [ellipsis, setEllipsis] = useState("");

    useEffect(() => {
        if (isLoading) {
            const intervalId = setInterval(() => {
                setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);
            return () => clearInterval(intervalId);
        } else {
            setEllipsis("");
        }
    }, [isLoading]);

    return ellipsis;
};

export default useLoadingAnimation;
