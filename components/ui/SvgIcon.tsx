type Icon =
    | "menu"
    | "right-arrow"
    | "note-book"
    | "approve"
    | "media"
    | "seprator";

export default function SvgIcon({ icon }: { icon: Icon }) {
    const icons = {
        menu: (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.999481 6.99609H16.9912" stroke="#274060" strokeWidth="1.99896" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0.999481 0.999512H16.9912" stroke="#274060" strokeWidth="1.99896" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0.999481 12.9932H16.9912" stroke="#274060" strokeWidth="1.99896" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        "right-arrow": (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.666504 5.33203H9.99774" stroke="#274060" strokeWidth="1.33303" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.33212 0.666504L9.99774 5.33212L5.33212 9.99774" stroke="#274060" strokeWidth="1.33303" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        "note-book": (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.9988 3.33301H9.99951C9.1155 3.33301 8.26769 3.68418 7.6426 4.30927C7.01751 4.93436 6.66634 5.78217 6.66634 6.66618V33.3315C6.66634 34.2156 7.01751 35.0634 7.6426 35.6885C8.26769 36.3135 9.1155 36.6647 9.99951 36.6647H29.9985C30.8825 36.6647 31.7303 36.3135 32.3554 35.6885C32.9805 35.0634 33.3317 34.2156 33.3317 33.3315V11.6659L24.9988 3.33301Z" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.3322 3.33301V9.99935C23.3322 10.8834 23.6834 11.7312 24.3085 12.3563C24.9336 12.9813 25.7814 13.3325 26.6654 13.3325H33.3317" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.6658 14.999H13.3327" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26.6654 21.666H13.3327" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M26.6654 28.332H13.3327" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        "approve": (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.3332 16.6655C37.0943 20.4008 36.5519 24.2842 34.7964 27.668C33.0409 31.0517 30.1783 33.7314 26.6862 35.2601C23.1941 36.7888 19.2834 37.0742 15.6064 36.0685C11.9294 35.0629 8.70822 32.827 6.48014 29.7339C4.25205 26.6408 3.15171 22.8773 3.3626 19.071C3.5735 15.2648 5.08288 11.6459 7.63904 8.81784C10.1952 5.98978 13.6436 4.12351 17.4093 3.53024C21.1749 2.93697 25.0301 3.65258 28.3319 5.55772" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.9993 18.3321L19.999 23.3319L36.6649 6.66602" stroke="white" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        "media": (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.2255 36.1417C24.2888 36.2995 24.3989 36.4341 24.5409 36.5275C24.683 36.621 24.8502 36.6687 25.0202 36.6644C25.1902 36.66 25.3547 36.6038 25.4918 36.5032C25.6289 36.4026 25.7319 36.2625 25.7871 36.1017L36.6199 4.43654C36.6732 4.28887 36.6834 4.12907 36.6492 3.97582C36.6151 3.82258 36.5379 3.68224 36.4269 3.57121C36.3159 3.46019 36.1756 3.38309 36.0223 3.34892C35.8691 3.31475 35.7093 3.32492 35.5616 3.37826L3.89648 14.2111C3.73565 14.2662 3.59553 14.3693 3.49495 14.5063C3.39437 14.6434 3.33812 14.808 3.33377 14.978C3.32942 15.1479 3.37716 15.3152 3.4706 15.4572C3.56403 15.5993 3.69868 15.7093 3.85648 15.7727L17.0725 21.0724C17.4903 21.2397 17.8699 21.4898 18.1884 21.8077C18.5069 22.1257 18.7577 22.5048 18.9257 22.9223L24.2255 36.1417Z" stroke="#274060" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M36.4216 3.57812L18.1891 21.8089" stroke="#274060" strokeWidth="3.33317" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        seprator: (
            <svg width="6" height="16" viewBox="0 0 6 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.375 10.3977C3.03125 10.3977 2.71733 10.3139 2.43324 10.1463C2.14915 9.97585 1.92188 9.74858 1.75142 9.46449C1.58381 9.1804 1.5 8.86648 1.5 8.52273C1.5 8.17614 1.58381 7.86222 1.75142 7.58097C1.92188 7.29687 2.14915 7.07102 2.43324 6.90341C2.71733 6.73295 3.03125 6.64773 3.375 6.64773C3.72159 6.64773 4.03551 6.73295 4.31676 6.90341C4.60085 7.07102 4.8267 7.29687 4.99432 7.58097C5.16477 7.86222 5.25 8.17614 5.25 8.52273C5.25 8.86648 5.16477 9.1804 4.99432 9.46449C4.8267 9.74858 4.60085 9.97585 4.31676 10.1463C4.03551 10.3139 3.72159 10.3977 3.375 10.3977Z" fill="#6A7282" />
            </svg>
        ),
    };

    return icons[icon] ?? null;
};