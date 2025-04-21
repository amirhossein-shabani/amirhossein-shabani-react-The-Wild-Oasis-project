import { useEffect, useRef } from "react";

// p - this is the regular fun and for that you don't allow to write argument like prop in { }   . ❌
export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target))
        // console.log("click outside");
        handler();
    }
    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}

//p . The ref Hook relate to this logic and we used this hook in Modal component for this work form the beginning so we have to use this hook in here, in our custom hook .

// p . and bacause we use ref in Modal we have to retrun that and use in Modal Component file like this :
// const ref (or [ref])= useOutsideClick(close).

// p . and also we can customize another thing like listenCapturing which we pass a default value for this argument which if programmar didn't write or use tis argument, don't throw a error .
