'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [rotation, setRot] = useState<number>();

    const handleClick = useCallback(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        if (rotation !== undefined) {
            setRot(rotation + 90);
        }
    }, [theme, setTheme, setRot, rotation]);

    useEffect(() => {
        if (rotation === undefined) {
            setRot(theme === 'dark' ? 0 : 90);
        }
    }, [theme, setRot, rotation]);

    return (
        <div
            onClick={handleClick}
            className="absolute -top-[60px] left-1/2 -ml-[60px] scale-75 rounded-full shadow-sm transition-transform hover:scale-100 hover:shadow-md"
        >
            <svg
                width="120"
                height="120"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 transition-colors hover:text-gray-500 dark:text-gray-400 hover:dark:text-gray-200"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    opacity: rotation === undefined ? 0 : 1,
                    transition: 'opacity 100ms ease-out, transform 500ms ease-in-out',
                }}
            >
                <circle
                    cx="40"
                    cy="40"
                    r="40"
                    className="fill-gray-300 transition-colors hover:fill-gray-200 dark:fill-gray-800 hover:dark:fill-gray-700"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M41.5183 59.2983C41.6115 58.9788 41.5396 58.634 41.3267 58.3783C41.1137 58.1226 40.7875 57.9896 40.4565 58.0235C36.4243 58.4361 33.2793 61.8409 33.2793 65.9816C33.2793 70.3999 36.861 73.9816 41.2793 73.9816C44.9202 73.9816 47.9905 71.5503 48.9603 68.2247C49.0534 67.9053 48.9816 67.5605 48.7686 67.3048C48.5557 67.0491 48.2295 66.9161 47.8985 66.95C47.6952 66.9708 47.4887 66.9815 47.2793 66.9815C43.9656 66.9815 41.2793 64.2952 41.2793 60.9815C41.2793 60.3957 41.363 59.8311 41.5183 59.2983ZM35.2793 65.9816C35.2793 63.3591 36.9624 61.1288 39.3069 60.3132C39.2886 60.5336 39.2793 60.7565 39.2793 60.9815C39.2793 65.1363 42.4467 68.5514 46.4986 68.9439C45.4663 70.7585 43.5148 71.9816 41.2793 71.9816C37.9656 71.9816 35.2793 69.2954 35.2793 65.9816Z"
                    fill="currentColor"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.4817 19.6834C39.3885 20.0029 39.4604 20.3477 39.6733 20.6034C39.8863 20.859 40.2125 20.992 40.5435 20.9582C44.5757 20.5456 47.7207 17.1407 47.7207 13C47.7207 8.58177 44.139 5.00005 39.7207 5.00005C36.0798 5.00005 33.0095 7.43141 32.0397 10.757C31.9466 11.0764 32.0184 11.4212 32.2314 11.6769C32.4443 11.9326 32.7705 12.0656 33.1015 12.0317C33.3048 12.0109 33.5113 12.0002 33.7207 12.0002C37.0344 12.0002 39.7207 14.6865 39.7207 18.0002C39.7207 18.586 39.637 19.1506 39.4817 19.6834ZM45.7207 13C45.7207 15.6225 44.0376 17.8528 41.6931 18.6685C41.7114 18.448 41.7207 18.2251 41.7207 18.0002C41.7207 13.8453 38.5533 10.4302 34.5014 10.0378C35.5337 8.22315 37.4852 7.00005 39.7207 7.00005C43.0344 7.00005 45.7207 9.68634 45.7207 13Z"
                    fill="currentColor"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14 30.9999H13.9949C13.4427 31.0002 12.9952 31.4482 12.9955 32.0005C12.9958 32.5528 13.4438 33.0002 13.996 32.9999L14 32.9999L14.004 32.9999C14.5562 33.0002 15.0042 32.5528 15.0045 32.0005C15.0048 31.4482 14.5573 31.0002 14.0051 30.9999H14ZM20.3604 33.6324C19.9697 33.2421 19.3365 33.2425 18.9462 33.6332C18.5559 34.0239 18.5562 34.6571 18.947 35.0474L18.9525 35.053C19.3428 35.4437 19.976 35.4441 20.3667 35.0538C20.7575 34.6634 20.7578 34.0303 20.3675 33.6395L20.3604 33.6324ZM9.05303 35.0474C9.44377 34.6571 9.44412 34.0239 9.05382 33.6332C8.66351 33.2425 8.03034 33.2421 7.6396 33.6324L7.63248 33.6395C7.24217 34.0303 7.24252 34.6634 7.63326 35.0538C8.02401 35.4441 8.65717 35.4437 9.04748 35.053L9.05303 35.0474ZM23 39.9949C22.9997 39.4426 22.5517 38.9951 21.9994 38.9954C21.4472 38.9957 20.9997 39.4437 21 39.996L21 39.9999L21 40.0039C20.9997 40.5562 21.4472 41.0041 21.9994 41.0044C22.5517 41.0048 22.9997 40.5573 23 40.005L23 39.9999L23 39.9949ZM7 39.996C7.00031 39.4437 6.55284 38.9957 6.00055 38.9954C5.44827 38.9951 5.00031 39.4426 5 39.9949V39.9999V40.005C5.00031 40.5573 5.44827 41.0048 6.00055 41.0044C6.55284 41.0041 7.00031 40.5562 7 40.0039L7 39.9999L7 39.996ZM20.3675 46.3603C20.7578 45.9696 20.7575 45.3364 20.3667 44.9461C19.976 44.5558 19.3428 44.5562 18.9525 44.9469L18.947 44.9525C18.5562 45.3428 18.5559 45.9759 18.9462 46.3667C19.3365 46.7574 19.9697 46.7578 20.3604 46.3675L20.3675 46.3603ZM9.04748 44.9469C8.65717 44.5562 8.02401 44.5558 7.63327 44.9461C7.24252 45.3364 7.24217 45.9696 7.63248 46.3603L7.6396 46.3675C8.03034 46.7578 8.66351 46.7574 9.05382 46.3667C9.44412 45.9759 9.44377 45.3428 9.05303 44.9525L9.04748 44.9469ZM13.996 46.9999C13.4438 46.9996 12.9958 47.4471 12.9955 47.9994C12.9952 48.5517 13.4427 48.9996 13.9949 48.9999L14 48.9999L14.0051 48.9999C14.5573 48.9996 15.0048 48.5517 15.0045 47.9994C15.0042 47.4471 14.5562 46.9996 14.004 46.9999L14 46.9999L13.996 46.9999ZM10 39.9999C10 37.7908 11.7909 35.9999 14 35.9999C16.2091 35.9999 18 37.7908 18 39.9999C18 42.2091 16.2091 43.9999 14 43.9999C11.7909 43.9999 10 42.2091 10 39.9999ZM14 33.9999C10.6863 33.9999 8 36.6862 8 39.9999C8 43.3136 10.6863 45.9999 14 45.9999C17.3137 45.9999 20 43.3136 20 39.9999C20 36.6862 17.3137 33.9999 14 33.9999Z"
                    fill="currentColor"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M66 30.9999H65.9949C65.4427 31.0002 64.9952 31.4482 64.9955 32.0005C64.9958 32.5528 65.4438 33.0002 65.996 32.9999L66 32.9999L66.004 32.9999C66.5562 33.0002 67.0042 32.5528 67.0045 32.0005C67.0048 31.4482 66.5573 31.0002 66.0051 30.9999H66ZM72.3604 33.6324C71.9697 33.2421 71.3365 33.2425 70.9462 33.6332C70.5559 34.0239 70.5562 34.6571 70.947 35.0474L70.9525 35.053C71.3428 35.4437 71.976 35.4441 72.3667 35.0538C72.7575 34.6634 72.7578 34.0303 72.3675 33.6395L72.3604 33.6324ZM61.053 35.0474C61.4438 34.6571 61.4441 34.0239 61.0538 33.6332C60.6635 33.2425 60.0303 33.2421 59.6396 33.6324L59.6325 33.6395C59.2422 34.0303 59.2425 34.6634 59.6333 35.0538C60.024 35.4441 60.6572 35.4437 61.0475 35.053L61.053 35.0474ZM75 39.9949C74.9997 39.4426 74.5517 38.9951 73.9994 38.9954C73.4472 38.9957 72.9997 39.4437 73 39.996L73 39.9999L73 40.0039C72.9997 40.5562 73.4472 41.0041 73.9994 41.0044C74.5517 41.0048 74.9997 40.5573 75 40.005L75 39.9999L75 39.9949ZM59 39.996C59.0003 39.4437 58.5528 38.9957 58.0006 38.9954C57.4483 38.9951 57.0003 39.4426 57 39.9949V39.9999V40.005C57.0003 40.5573 57.4483 41.0048 58.0006 41.0044C58.5528 41.0041 59.0003 40.5562 59 40.0039L59 39.9999L59 39.996ZM72.3675 46.3603C72.7578 45.9696 72.7575 45.3364 72.3667 44.9461C71.976 44.5558 71.3428 44.5562 70.9525 44.9469L70.947 44.9525C70.5562 45.3428 70.5559 45.9759 70.9462 46.3667C71.3365 46.7574 71.9697 46.7578 72.3604 46.3675L72.3675 46.3603ZM61.0475 44.9469C60.6572 44.5562 60.024 44.5558 59.6333 44.9461C59.2425 45.3364 59.2422 45.9696 59.6325 46.3603L59.6396 46.3675C60.0303 46.7578 60.6635 46.7574 61.0538 46.3667C61.4441 45.9759 61.4438 45.3428 61.053 44.9525L61.0475 44.9469ZM65.996 46.9999C65.4438 46.9996 64.9958 47.4471 64.9955 47.9994C64.9952 48.5517 65.4427 48.9996 65.9949 48.9999L66 48.9999L66.0051 48.9999C66.5573 48.9996 67.0048 48.5517 67.0045 47.9994C67.0042 47.4471 66.5562 46.9996 66.004 46.9999L66 46.9999L65.996 46.9999ZM62 39.9999C62 37.7908 63.7909 35.9999 66 35.9999C68.2091 35.9999 70 37.7908 70 39.9999C70 42.2091 68.2091 43.9999 66 43.9999C63.7909 43.9999 62 42.2091 62 39.9999ZM66 33.9999C62.6863 33.9999 60 36.6862 60 39.9999C60 43.3136 62.6863 45.9999 66 45.9999C69.3137 45.9999 72 43.3136 72 39.9999C72 36.6862 69.3137 33.9999 66 33.9999Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
}
