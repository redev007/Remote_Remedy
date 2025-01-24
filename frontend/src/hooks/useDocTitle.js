import { useEffect } from 'react';
 
const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - Remote_Remedy`;
        } else {
            document.title = 'Remote_Remedy';
        }
    }, [title]);

    return null;
};

export default useDocTitle;