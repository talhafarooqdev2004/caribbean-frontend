export type Icon =
  | "menu"
  | "right-arrow-large"
  | "right-arrow"
  | "left-arrow"
  | "note-book"
  | "approve"
  | "approve-soft-blue"
  | "media"
  | "dot-seprator"
  | "line-seprator"
  | "target"
  | "peoples"
  | "compaign-based-distribution"
  | "soft-blue-tick"
  | "yellow-tick"
  | "greyish-tick"
  | "star"
  | "down-arrow"
  | "rocket-icon"
  | "up-arrow"
  | "relevant-curated-content"
  | "map"
  | "free-to-join"
  | "envelope"
  | "rocket"
  | "contact-us"
  | "filter"
  | "search"
  | "membership-for-media"
  | "receive-press"
  | "discover-story"
  | "access-news"
  | "stay-informed"
  | "journalists-and-reporters"
  | "editors-and-producers"
  | "radio-and-television-hosts"
  | "podcasters-and-digital-creators"
  | "bloggers-covering-caribbean-topics"
  | "news-organizations-and-media-outlets"
  | "become-partner-point"
  | "free-for-media"
  | "verified-content"
  | "regional-focus"
  | "curated-distribution"
  | "payment-successfull"
  | "contact-information"
  | "press-release-details"
  | "portal-status-live"
  | "portal-status-awaiting-payment"
  | "portal-status-under-review"
  | "portal-status-rejected";

export default function SvgIcon({ icon }: { icon: Icon }) {
  const icons = {
    menu: (
      <svg
        style={{ width: "20px", height: "20px" }}
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.999481 6.99609H16.9912"
          stroke="#274060"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.999481 0.999512H16.9912"
          stroke="#274060"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.999481 12.9932H16.9912"
          stroke="#274060"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "right-arrow-large": (
      <svg
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.666504 5.33203H9.99774"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.33212 0.666504L9.99774 5.33212L5.33212 9.99774"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "right-arrow": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.99854 11.9972L9.99763 7.99812L5.99854 3.99902"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "left-arrow": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.99763 11.9972L5.99854 7.99812L9.99763 3.99902"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "note-book": (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.9988 3.33301H9.99951C9.1155 3.33301 8.26769 3.68418 7.6426 4.30927C7.01751 4.93436 6.66634 5.78217 6.66634 6.66618V33.3315C6.66634 34.2156 7.01751 35.0634 7.6426 35.6885C8.26769 36.3135 9.1155 36.6647 9.99951 36.6647H29.9985C30.8825 36.6647 31.7303 36.3135 32.3554 35.6885C32.9805 35.0634 33.3317 34.2156 33.3317 33.3315V11.6659L24.9988 3.33301Z"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.3322 3.33301V9.99935C23.3322 10.8834 23.6834 11.7312 24.3085 12.3563C24.9336 12.9813 25.7814 13.3325 26.6654 13.3325H33.3317"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.6658 14.999H13.3327"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.6654 21.666H13.3327"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.6654 28.332H13.3327"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    approve: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.3332 16.6655C37.0943 20.4008 36.5519 24.2842 34.7964 27.668C33.0409 31.0517 30.1783 33.7314 26.6862 35.2601C23.1941 36.7888 19.2834 37.0742 15.6064 36.0685C11.9294 35.0629 8.70822 32.827 6.48014 29.7339C4.25205 26.6408 3.15171 22.8773 3.3626 19.071C3.5735 15.2648 5.08288 11.6459 7.63904 8.81784C10.1952 5.98978 13.6436 4.12351 17.4093 3.53024C21.1749 2.93697 25.0301 3.65258 28.3319 5.55772"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.9993 18.3321L19.999 23.3319L36.6649 6.66602"
          stroke="white"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "approve-soft-blue": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.7897 9.99437C22.2461 12.2345 21.9208 14.5634 20.868 16.5927C19.8152 18.622 18.0985 20.2291 16.0042 21.1459C13.9099 22.0627 11.5646 22.2338 9.35945 21.6307C7.15426 21.0276 5.22249 19.6867 3.88627 17.8317C2.55005 15.9767 1.89015 13.7197 2.01663 11.437C2.1431 9.15434 3.04831 6.98402 4.58128 5.28798C6.11426 3.59195 8.18234 2.47271 10.4407 2.11691C12.699 1.76112 15.011 2.19028 16.9912 3.33283"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.99533 10.9944L11.9938 13.9929L21.9886 3.99805"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    media: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.2255 36.1417C24.2888 36.2995 24.3989 36.4341 24.5409 36.5275C24.683 36.621 24.8502 36.6687 25.0202 36.6644C25.1902 36.66 25.3547 36.6038 25.4918 36.5032C25.6289 36.4026 25.7319 36.2625 25.7871 36.1017L36.6199 4.43654C36.6732 4.28887 36.6834 4.12907 36.6492 3.97582C36.6151 3.82258 36.5379 3.68224 36.4269 3.57121C36.3159 3.46019 36.1756 3.38309 36.0223 3.34892C35.8691 3.31475 35.7093 3.32492 35.5616 3.37826L3.89648 14.2111C3.73565 14.2662 3.59553 14.3693 3.49495 14.5063C3.39437 14.6434 3.33812 14.808 3.33377 14.978C3.32942 15.1479 3.37716 15.3152 3.4706 15.4572C3.56403 15.5993 3.69868 15.7093 3.85648 15.7727L17.0725 21.0724C17.4903 21.2397 17.8699 21.4898 18.1884 21.8077C18.5069 22.1257 18.7577 22.5048 18.9257 22.9223L24.2255 36.1417Z"
          stroke="#274060"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36.4216 3.57812L18.1891 21.8089"
          stroke="#274060"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "dot-seprator": (
      <svg
        width="6"
        height="16"
        viewBox="0 0 6 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.375 10.3977C3.03125 10.3977 2.71733 10.3139 2.43324 10.1463C2.14915 9.97585 1.92188 9.74858 1.75142 9.46449C1.58381 9.1804 1.5 8.86648 1.5 8.52273C1.5 8.17614 1.58381 7.86222 1.75142 7.58097C1.92188 7.29687 2.14915 7.07102 2.43324 6.90341C2.71733 6.73295 3.03125 6.64773 3.375 6.64773C3.72159 6.64773 4.03551 6.73295 4.31676 6.90341C4.60085 7.07102 4.8267 7.29687 4.99432 7.58097C5.16477 7.86222 5.25 8.17614 5.25 8.52273C5.25 8.86648 5.16477 9.1804 4.99432 9.46449C4.8267 9.74858 4.60085 9.97585 4.31676 10.1463C4.03551 10.3139 3.72159 10.3977 3.375 10.3977Z"
          fill="#6A7282"
        />
      </svg>
    ),
    "line-seprator": (
      <svg
        width="4"
        height="16"
        viewBox="0 0 4 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.38636 0.460227V14.8125H1.53409V0.460227H2.38636Z"
          fill="#6A7282"
        />
      </svg>
    ),
    target: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9985 25.664C20.4412 25.664 25.664 20.4412 25.664 13.9985C25.664 7.55583 20.4412 2.33301 13.9985 2.33301C7.55583 2.33301 2.33301 7.55583 2.33301 13.9985C2.33301 20.4412 7.55583 25.664 13.9985 25.664Z"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9986 20.9976C17.8642 20.9976 20.9979 17.8639 20.9979 13.9983C20.9979 10.1327 17.8642 6.99902 13.9986 6.99902C10.133 6.99902 6.99927 10.1327 6.99927 13.9983C6.99927 17.8639 10.133 20.9976 13.9986 20.9976Z"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9986 16.3312C15.2872 16.3312 16.3317 15.2867 16.3317 13.9981C16.3317 12.7096 15.2872 11.665 13.9986 11.665C12.7101 11.665 11.6655 12.7096 11.6655 13.9981C11.6655 15.2867 12.7101 16.3312 13.9986 16.3312Z"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    peoples: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.6647 24.4974V22.1643C18.6647 20.9267 18.1731 19.7398 17.298 18.8647C16.4229 17.9897 15.2361 17.498 13.9985 17.498H6.99921C5.76166 17.498 4.57479 17.9897 3.69971 18.8647C2.82462 19.7398 2.33301 20.9267 2.33301 22.1643V24.4974"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.499 12.8324C13.076 12.8324 15.1652 10.7433 15.1652 8.1662C15.1652 5.58913 13.076 3.5 10.499 3.5C7.92189 3.5 5.83276 5.58913 5.83276 8.1662C5.83276 10.7433 7.92189 12.8324 10.499 12.8324Z"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.6642 24.498V22.1649C25.6634 21.1311 25.3193 20.1267 24.6859 19.3096C24.0525 18.4925 23.1656 17.9089 22.1646 17.6504"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.6648 3.65137C19.6685 3.90836 20.5582 4.4921 21.1935 5.31056C21.8288 6.12903 22.1736 7.13566 22.1736 8.17175C22.1736 9.20785 21.8288 10.2145 21.1935 11.0329C20.5582 11.8514 19.6685 12.4351 18.6648 12.6921"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "compaign-based-distribution": (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.66613 16.3317C4.44538 16.3325 4.22895 16.2706 4.04198 16.1532C3.855 16.0359 3.70517 15.8679 3.60988 15.6687C3.51459 15.4696 3.47776 15.2475 3.50367 15.0283C3.52957 14.8091 3.61715 14.6017 3.75622 14.4303L15.3051 2.53143C15.3917 2.43143 15.5098 2.36386 15.6399 2.3398C15.77 2.31575 15.9044 2.33663 16.021 2.39903C16.1377 2.46143 16.2297 2.56164 16.2819 2.68321C16.3341 2.80478 16.3434 2.94048 16.3083 3.06804L14.0685 10.0907C14.0025 10.2674 13.9803 10.4576 14.0039 10.6448C14.0275 10.832 14.0961 11.0107 14.204 11.1656C14.3118 11.3204 14.4556 11.4468 14.623 11.5339C14.7904 11.621 14.9764 11.6661 15.1651 11.6655H23.331C23.5517 11.6648 23.7681 11.7267 23.9551 11.844C24.1421 11.9614 24.2919 12.1294 24.3872 12.3285C24.4825 12.5277 24.5193 12.7497 24.4934 12.969C24.4675 13.1882 24.3799 13.3956 24.2409 13.567L12.692 25.4658C12.6054 25.5658 12.4873 25.6334 12.3572 25.6574C12.2271 25.6815 12.0927 25.6606 11.9761 25.5982C11.8594 25.5358 11.7674 25.4356 11.7152 25.314C11.663 25.1925 11.6537 25.0568 11.6888 24.9292L13.9285 17.9066C13.9946 17.7298 14.0168 17.5397 13.9932 17.3525C13.9696 17.1652 13.9009 16.9865 13.7931 16.8317C13.6853 16.6768 13.5415 16.5504 13.3741 16.4634C13.2067 16.3763 13.0207 16.3311 12.832 16.3317H4.66613Z"
          stroke="white"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "soft-blue-tick": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.66 4.99805L7.49702 14.161L3.33203 9.99604"
          stroke="#5899E2"
          strokeWidth="1.666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "yellow-tick": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.66 4.99805L7.49702 14.161L3.33203 9.99604"
          stroke="#FFC400"
          strokeWidth="1.666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "greyish-tick": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.66 4.99805L7.49702 14.161L3.33203 9.99604"
          stroke="#274060"
          strokeWidth="1.666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    star: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_113_800)">
          <path
            d="M9.60036 1.91166C9.63687 1.83791 9.69326 1.77583 9.76317 1.73242C9.83309 1.68902 9.91374 1.66602 9.99604 1.66602C10.0783 1.66602 10.159 1.68902 10.2289 1.73242C10.2988 1.77583 10.3552 1.83791 10.3917 1.91166L12.3159 5.80926C12.4427 6.0658 12.6298 6.28774 12.8612 6.45605C13.0927 6.62435 13.3615 6.73398 13.6446 6.77554L17.9478 7.40529C18.0294 7.4171 18.106 7.4515 18.169 7.50458C18.232 7.55766 18.2789 7.62732 18.3044 7.70567C18.3299 7.78402 18.3329 7.86794 18.3132 7.94793C18.2935 8.02793 18.2517 8.1008 18.1927 8.15832L15.0807 11.1888C14.8754 11.3888 14.7219 11.6357 14.6332 11.9082C14.5445 12.1807 14.5234 12.4707 14.5717 12.7531L15.3064 17.0348C15.3208 17.1163 15.312 17.2002 15.281 17.2769C15.25 17.3536 15.1981 17.4201 15.1311 17.4687C15.0641 17.5174 14.9848 17.5462 14.9023 17.552C14.8197 17.5577 14.7372 17.5401 14.6642 17.5012L10.8174 15.4787C10.5639 15.3456 10.2819 15.2761 9.99562 15.2761C9.70933 15.2761 9.42733 15.3456 9.17387 15.4787L5.32791 17.5012C5.25488 17.5399 5.17247 17.5573 5.09005 17.5514C5.00763 17.5456 4.9285 17.5167 4.86168 17.4681C4.79485 17.4195 4.74301 17.3531 4.71204 17.2765C4.68107 17.1999 4.67222 17.1161 4.6865 17.0348L5.42037 12.754C5.46885 12.4714 5.44785 12.1812 5.35918 11.9085C5.27051 11.6358 5.11684 11.3888 4.91141 11.1888L1.79933 8.15915C1.73985 8.1017 1.6977 8.0287 1.67768 7.94846C1.65766 7.86823 1.66058 7.78398 1.68611 7.70533C1.71163 7.62667 1.75874 7.55676 1.82205 7.50357C1.88537 7.45037 1.96235 7.41603 2.04423 7.40445L6.34667 6.77554C6.6301 6.73431 6.89927 6.62482 7.13101 6.45649C7.36274 6.28817 7.5501 6.06605 7.67697 5.80926L9.60036 1.91166Z"
            stroke="#FFC400"
            strokeWidth="1.666"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_113_800">
            <rect width="19.992" height="19.992" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    "down-arrow": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.99902 5.99902L7.99812 9.99812L11.9972 5.99902"
          stroke="#717182"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "rocket-icon": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.99932 10.9977C1.99955 11.8375 1.66629 14.3303 1.66629 14.3303C1.66629 14.3303 4.15906 13.997 4.99887 12.9972C5.4721 12.4374 5.46543 11.5776 4.93889 11.0577C4.67982 10.8104 4.33855 10.6675 3.98059 10.6565C3.62262 10.6454 3.27318 10.7669 2.99932 10.9977Z"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99821 9.99789L5.99866 7.99834C6.35334 7.07817 6.79995 6.19612 7.33169 5.3656C8.1083 4.12387 9.18969 3.10147 10.473 2.39566C11.7563 1.68985 13.1988 1.32409 14.6634 1.33317C14.6634 3.1461 14.1435 6.33205 10.6643 8.66486C9.82239 9.19722 8.92923 9.6438 7.99821 9.99789Z"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.99866 7.9982H2.66608C2.66608 7.9982 3.03266 5.97866 3.99911 5.33213C5.07887 4.6123 7.33169 5.33213 7.33169 5.33213"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.9982 9.99758V13.3302C7.9982 13.3302 10.0177 12.9636 10.6643 11.9971C11.3841 10.9174 10.6643 8.66455 10.6643 8.66455"
          stroke="#274060"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "up-arrow": (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.6641 8.16602L15.7484 18.0817L9.91568 12.2489L2.3331 19.8315"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.6648 8.16602H25.6641V15.1653"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "relevant-curated-content": (
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.6082 21.1299H11.7387"
          stroke="#FFC400"
          strokeWidth="2.34779"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.1299 16.4341H11.7387"
          stroke="#FFC400"
          strokeWidth="2.34779"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.69554 25.8255H23.4778C24.1005 25.8255 24.6977 25.5782 25.138 25.1379C25.5783 24.6976 25.8256 24.1004 25.8256 23.4778V4.69544C25.8256 4.07277 25.5783 3.4756 25.138 3.03531C24.6977 2.59501 24.1005 2.34766 23.4778 2.34766H9.39111C8.76844 2.34766 8.17127 2.59501 7.73098 3.03531C7.29068 3.4756 7.04332 4.07277 7.04332 4.69544V23.4778C7.04332 24.1004 6.79597 24.6976 6.35567 25.1379C5.91538 25.5782 5.31821 25.8255 4.69554 25.8255ZM4.69554 25.8255C4.07286 25.8255 3.47569 25.5782 3.0354 25.1379C2.5951 24.6976 2.34775 24.1004 2.34775 23.4778V12.9127C2.34775 12.29 2.5951 11.6929 3.0354 11.2526C3.47569 10.8123 4.07286 10.5649 4.69554 10.5649H7.04332"
          stroke="#FFC400"
          strokeWidth="2.34779"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.956 7.04346H12.9126C12.2643 7.04346 11.7387 7.56903 11.7387 8.21735V10.5651C11.7387 11.2135 12.2643 11.739 12.9126 11.739H19.956C20.6043 11.739 21.1299 11.2135 21.1299 10.5651V8.21735C21.1299 7.56903 20.6043 7.04346 19.956 7.04346Z"
          stroke="#FFC400"
          strokeWidth="2.34779"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    map: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.9986 25.664C20.4413 25.664 25.6641 20.4412 25.6641 13.9985C25.6641 7.55583 20.4413 2.33301 13.9986 2.33301C7.55593 2.33301 2.3331 7.55583 2.3331 13.9985C2.3331 20.4412 7.55593 25.664 13.9986 25.664Z"
          stroke="#274060"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.9986 2.33301C11.0032 5.47821 9.3324 9.65515 9.3324 13.9985C9.3324 18.3419 11.0032 22.5188 13.9986 25.664C16.994 22.5188 18.6648 18.3419 18.6648 13.9985C18.6648 9.65515 16.994 5.47821 13.9986 2.33301Z"
          stroke="#274060"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.3331 13.9985H25.6641"
          stroke="#274060"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "free-to-join": (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.592 18.0817C11.4879 17.678 11.2774 17.3096 10.9826 17.0148C10.6878 16.72 10.3194 16.5096 9.91569 16.4054L2.7589 14.5599C2.6368 14.5253 2.52933 14.4517 2.45281 14.3505C2.37629 14.2492 2.33488 14.1257 2.33488 13.9988C2.33488 13.8719 2.37629 13.7484 2.45281 13.6472C2.52933 13.5459 2.6368 13.4724 2.7589 13.4377L9.91569 11.591C10.3193 11.487 10.6876 11.2767 10.9824 10.9822C11.2772 10.6876 11.4877 10.3194 11.592 9.91588L13.4375 2.75909C13.4718 2.63651 13.5453 2.52851 13.6467 2.45158C13.7481 2.37465 13.8719 2.33301 13.9992 2.33301C14.1265 2.33301 14.2503 2.37465 14.3517 2.45158C14.4531 2.52851 14.5266 2.63651 14.5609 2.75909L16.4052 9.91588C16.5094 10.3196 16.7198 10.688 17.0146 10.9828C17.3094 11.2776 17.6778 11.4881 18.0815 11.5922L25.2383 13.4365C25.3614 13.4705 25.4699 13.5439 25.5473 13.6454C25.6246 13.747 25.6665 13.8711 25.6665 13.9988C25.6665 14.1265 25.6246 14.2506 25.5473 14.3522C25.4699 14.4538 25.3614 14.5271 25.2383 14.5611L18.0815 16.4054C17.6778 16.5096 17.3094 16.72 17.0146 17.0148C16.7198 17.3096 16.5094 17.678 16.4052 18.0817L14.5597 25.2385C14.5254 25.3611 14.452 25.4691 14.3505 25.546C14.2491 25.623 14.1253 25.6646 13.998 25.6646C13.8707 25.6646 13.7469 25.623 13.6455 25.546C13.5441 25.4691 13.4706 25.3611 13.4363 25.2385L11.592 18.0817Z"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.331 3.5V8.1662"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.6641 5.83301H20.9979"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.6662 19.8311V22.1642"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.83277 20.998H3.49966"
          stroke="#5899E2"
          strokeWidth="2.3331"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    envelope: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.3303 2.66602H2.66607C1.92986 2.66602 1.33304 3.26283 1.33304 3.99905V11.9972C1.33304 12.7335 1.92986 13.3303 2.66607 13.3303H13.3303C14.0666 13.3303 14.6634 12.7335 14.6634 11.9972V3.99905C14.6634 3.26283 14.0666 2.66602 13.3303 2.66602Z"
          stroke="white"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6634 4.66602L8.68472 8.46516C8.47894 8.59408 8.24103 8.66246 7.9982 8.66246C7.75538 8.66246 7.51746 8.59408 7.31169 8.46516L1.33304 4.66602"
          stroke="white"
          strokeWidth="1.33303"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    rocket: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_292_2823)">
          <path
            d="M2.99932 10.9972C1.99955 11.837 1.66629 14.3298 1.66629 14.3298C1.66629 14.3298 4.15906 13.9965 4.99887 12.9968C5.4721 12.4369 5.46543 11.5771 4.93889 11.0572C4.67982 10.8099 4.33855 10.667 3.98059 10.656C3.62262 10.6449 3.27318 10.7664 2.99932 10.9972Z"
            stroke="#274060"
            strokeWidth="1.33303"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.99821 9.99789L5.99866 7.99834C6.35334 7.07817 6.79995 6.19612 7.33169 5.3656C8.1083 4.12387 9.18969 3.10147 10.473 2.39566C11.7563 1.68985 13.1988 1.32409 14.6634 1.33317C14.6634 3.1461 14.1435 6.33205 10.6643 8.66486C9.82239 9.19722 8.92923 9.6438 7.99821 9.99789Z"
            stroke="#274060"
            strokeWidth="1.33303"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.99866 7.99771H2.66608C2.66608 7.99771 3.03266 5.97817 3.99911 5.33165C5.07887 4.61181 7.33169 5.33165 7.33169 5.33165"
            stroke="#274060"
            strokeWidth="1.33303"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.9982 9.99807V13.3307C7.9982 13.3307 10.0177 12.9641 10.6643 11.9976C11.3841 10.9179 10.6643 8.66504 10.6643 8.66504"
            stroke="#274060"
            strokeWidth="1.33303"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_292_2823">
            <rect width="15.9964" height="15.9964" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    "contact-us": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.9907 1.99902H5.99689C4.89289 1.99902 3.99792 2.89399 3.99792 3.99798V19.9897C3.99792 21.0937 4.89289 21.9886 5.99689 21.9886H17.9907C19.0947 21.9886 19.9896 21.0937 19.9896 19.9897V3.99798C19.9896 2.89399 19.0947 1.99902 17.9907 1.99902Z"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.9953 21.9882V17.9902H14.9922V21.9882"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99585 5.99707H8.00585"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9917 5.99707H16.0017"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9938 5.99707H12.0038"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9938 9.99512H12.0038"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9938 13.9932H12.0038"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9917 9.99512H16.0017"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9917 13.9932H16.0017"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99585 9.99512H8.00585"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99585 13.9932H8.00585"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    filter: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_113_1037)">
          <path
            d="M8.33019 16.66C8.33012 16.8148 8.37318 16.9666 8.45455 17.0982C8.53592 17.2299 8.65237 17.3363 8.79084 17.4055L10.4568 18.2385C10.5839 18.302 10.725 18.332 10.8669 18.3255C11.0087 18.3191 11.1466 18.2765 11.2674 18.2018C11.3881 18.1271 11.4878 18.0228 11.5569 17.8987C11.626 17.7747 11.6623 17.635 11.6622 17.493V11.662C11.6624 11.2492 11.8158 10.8511 12.0928 10.545L18.1096 3.89013C18.2174 3.77064 18.2883 3.62247 18.3138 3.46354C18.3392 3.3046 18.318 3.14171 18.2528 2.99455C18.1876 2.8474 18.0811 2.72229 17.9463 2.63435C17.8115 2.54641 17.6541 2.4994 17.4932 2.49902H2.4992C2.33811 2.49908 2.18048 2.54585 2.04543 2.63367C1.91037 2.72148 1.80367 2.84657 1.73826 2.99379C1.67285 3.14101 1.65153 3.30404 1.67689 3.46313C1.70224 3.62222 1.77318 3.77054 1.88112 3.89013L7.89953 10.545C8.17653 10.8511 8.33001 11.2492 8.33019 11.662V16.66Z"
            stroke="#364153"
            strokeWidth="1.666"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_113_1037">
            <rect width="19.992" height="19.992" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    search: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.16301 15.827C12.8434 15.827 15.827 12.8434 15.827 9.16301C15.827 5.48259 12.8434 2.49902 9.16301 2.49902C5.48259 2.49902 2.49902 5.48259 2.49902 9.16301C2.49902 12.8434 5.48259 15.827 9.16301 15.827Z"
          stroke="#99A1AF"
          strokeWidth="1.666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.493 17.493L13.9111 13.9111"
          stroke="#99A1AF"
          strokeWidth="1.666"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "membership-for-media": (
      <svg
        width="27"
        height="27"
        viewBox="0 0 19 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.8006 10.4524C17.1526 12.1797 16.9018 13.9754 16.09 15.54C15.2782 17.1047 13.9546 18.3438 12.3398 19.0507C10.725 19.7576 8.91668 19.8895 7.2164 19.4245C5.51611 18.9595 4.02663 17.9256 2.99635 16.4953C1.96607 15.0651 1.45726 13.3248 1.55478 11.5648C1.65229 9.80473 2.35024 8.13132 3.53223 6.82361C4.71422 5.51589 6.3088 4.65291 8.05005 4.37858C9.7913 4.10425 11.574 4.43515 13.1008 5.3161"
          stroke="#274060"
          strokeWidth="1.54128"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.93555 11.2231L9.24747 13.535L16.9539 5.82861"
          stroke="#274060"
          strokeWidth="1.54128"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "receive-press": (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26.6606 5.33215H5.33208C3.85965 5.33215 2.66602 6.52579 2.66602 7.99822V23.9946C2.66602 25.467 3.85965 26.6607 5.33208 26.6607H26.6606C28.133 26.6607 29.3267 25.467 29.3267 23.9946V7.99822C29.3267 6.52579 28.133 5.33215 26.6606 5.33215Z"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29.3267 9.33118L17.3694 16.9295C16.9578 17.1873 16.482 17.3241 15.9963 17.3241C15.5107 17.3241 15.0349 17.1873 14.6233 16.9295L2.66602 9.33118"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "discover-story": (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.9963 29.3267C23.3585 29.3267 29.3267 23.3585 29.3267 15.9963C29.3267 8.63421 23.3585 2.66602 15.9963 2.66602C8.63421 2.66602 2.66602 8.63421 2.66602 15.9963C2.66602 23.3585 8.63421 29.3267 15.9963 29.3267Z"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9962 23.9946C20.4135 23.9946 23.9944 20.4137 23.9944 15.9964C23.9944 11.5791 20.4135 7.99817 15.9962 7.99817C11.579 7.99817 7.99805 11.5791 7.99805 15.9964C7.99805 20.4137 11.579 23.9946 15.9962 23.9946Z"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9961 18.6622C17.4686 18.6622 18.6622 17.4686 18.6622 15.9961C18.6622 14.5237 17.4686 13.3301 15.9961 13.3301C14.5237 13.3301 13.3301 14.5237 13.3301 15.9961C13.3301 17.4686 14.5237 18.6622 15.9961 18.6622Z"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "access-news": (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.9952 23.9941H13.3301"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.9943 18.6621H13.3301"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.33208 29.3267H26.6606C27.3677 29.3267 28.0458 29.0458 28.5458 28.5458C29.0458 28.0458 29.3267 27.3677 29.3267 26.6606V5.33208C29.3267 4.625 29.0458 3.94687 28.5458 3.44689C28.0458 2.9469 27.3677 2.66602 26.6606 2.66602H10.6642C9.95713 2.66602 9.279 2.9469 8.77902 3.44689C8.27904 3.94687 7.99815 4.625 7.99815 5.33208V26.6606C7.99815 27.3677 7.71726 28.0458 7.21728 28.5458C6.71729 29.0458 6.03917 29.3267 5.33208 29.3267ZM5.33208 29.3267C4.625 29.3267 3.94687 29.0458 3.44689 28.5458C2.9469 28.0458 2.66602 27.3677 2.66602 26.6606V14.6633C2.66602 13.9562 2.9469 13.2781 3.44689 12.7781C3.94687 12.2781 4.625 11.9972 5.33208 11.9972H7.99815"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.6613 7.99805H14.6631C13.9269 7.99805 13.3301 8.59487 13.3301 9.33108V11.9971C13.3301 12.7334 13.9269 13.3302 14.6631 13.3302H22.6613C23.3975 13.3302 23.9943 12.7334 23.9943 11.9971V9.33108C23.9943 8.59487 23.3975 7.99805 22.6613 7.99805Z"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "stay-informed": (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.3285 27.9933V25.3272C21.3285 23.9131 20.7667 22.5568 19.7667 21.5569C18.7668 20.5569 17.4105 19.9951 15.9963 19.9951H7.99815C6.58398 19.9951 5.22773 20.5569 4.22776 21.5569C3.22779 22.5568 2.66602 23.9131 2.66602 25.3272V27.9933"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9972 14.6634C14.942 14.6634 17.3293 12.2761 17.3293 9.33128C17.3293 6.38642 14.942 3.99915 11.9972 3.99915C9.05232 3.99915 6.66504 6.38642 6.66504 9.33128C6.66504 12.2761 9.05232 14.6634 11.9972 14.6634Z"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29.3262 27.9938V25.3278C29.3254 24.1464 28.9321 22.9987 28.2083 22.0649C27.4845 21.1312 26.4711 20.4643 25.3271 20.1689"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.3281 4.17285C22.4751 4.46652 23.4917 5.13357 24.2177 6.06884C24.9436 7.00411 25.3377 8.15439 25.3377 9.33835C25.3377 10.5223 24.9436 11.6726 24.2177 12.6079C23.4917 13.5431 22.4751 14.2102 21.3281 14.5039"
          stroke="white"
          strokeWidth="2.66607"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "journalists-and-reporters": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.9925 17.9902H9.99512"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.991 13.9932H9.99512"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.99798 21.9886H19.9897C20.5198 21.9886 21.0283 21.778 21.4032 21.4031C21.778 21.0282 21.9886 20.5198 21.9886 19.9896V3.99792C21.9886 3.46777 21.778 2.95932 21.4032 2.58444C21.0283 2.20957 20.5198 1.99896 19.9897 1.99896H7.99591C7.46575 1.99896 6.95731 2.20957 6.58243 2.58444C6.20755 2.95932 5.99695 3.46777 5.99695 3.99792V19.9896C5.99695 20.5198 5.78634 21.0282 5.41146 21.4031C5.03659 21.778 4.52814 21.9886 3.99798 21.9886ZM3.99798 21.9886C3.46783 21.9886 2.95938 21.778 2.58451 21.4031C2.20963 21.0282 1.99902 20.5198 1.99902 19.9896V10.9943C1.99902 10.4641 2.20963 9.95569 2.58451 9.58081C2.95938 9.20593 3.46783 8.99533 3.99798 8.99533H5.99695"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9915 5.99689H10.9946C10.4426 5.99689 9.99512 6.44437 9.99512 6.99637V8.99533C9.99512 9.54733 10.4426 9.99481 10.9946 9.99481H16.9915C17.5435 9.99481 17.991 9.54733 17.991 8.99533V6.99637C17.991 6.44437 17.5435 5.99689 16.9915 5.99689Z"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "editors-and-producers": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.9918 20.9891V18.9901C15.9918 17.9298 15.5705 16.9129 14.8208 16.1632C14.071 15.4134 13.0541 14.9922 11.9938 14.9922H5.99695C4.93663 14.9922 3.91974 15.4134 3.16999 16.1632C2.42023 16.9129 1.99902 17.9298 1.99902 18.9901V20.9891"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.99499 10.9939C11.203 10.9939 12.9929 9.20396 12.9929 6.99597C12.9929 4.78798 11.203 2.99805 8.99499 2.99805C6.787 2.99805 4.99707 4.78798 4.99707 6.99597C4.99707 9.20396 6.787 10.9939 8.99499 10.9939Z"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.9887 20.9891V18.9901C21.988 18.1043 21.6932 17.2438 21.1505 16.5437C20.6078 15.8436 19.8479 15.3436 18.9902 15.1221"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.9912 3.12793C16.8512 3.34812 17.6134 3.84826 18.1577 4.5495C18.702 5.25075 18.9975 6.11321 18.9975 7.00092C18.9975 7.88863 18.702 8.75109 18.1577 9.45233C17.6134 10.1536 16.8512 10.6537 15.9912 10.8739"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "radio-and-television-hosts": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_113_1429)">
          <path
            d="M4.89711 19.0901C0.999139 15.1921 0.999139 8.79544 4.89711 4.89746"
            stroke="#5899E2"
            strokeWidth="1.99896"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.79539 16.1919C5.49659 13.8931 5.49659 10.095 7.79539 7.69629"
            stroke="#5899E2"
            strokeWidth="1.99896"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.9941 13.993C13.0981 13.993 13.993 13.0981 13.993 11.9941C13.993 10.8901 13.0981 9.99512 11.9941 9.99512C10.8901 9.99512 9.99512 10.8901 9.99512 11.9941C9.99512 13.0981 10.8901 13.993 11.9941 13.993Z"
            stroke="#5899E2"
            strokeWidth="1.99896"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.1914 7.79596C18.4902 10.0948 18.4902 13.8928 16.1914 16.2915"
            stroke="#5899E2"
            strokeWidth="1.99896"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.0898 4.89746C22.9878 8.79544 22.9878 15.0922 19.0898 18.9901"
            stroke="#5899E2"
            strokeWidth="1.99896"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_113_1429">
            <rect width="23.9875" height="23.9875" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    "podcasters-and-digital-creators": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.9936 1.99896C11.1983 1.99896 10.4357 2.31487 9.87334 2.87719C9.31102 3.4395 8.99512 4.20217 8.99512 4.9974V11.9938C8.99512 12.789 9.31102 13.5517 9.87334 14.114C10.4357 14.6763 11.1983 14.9922 11.9936 14.9922C12.7888 14.9922 13.5515 14.6763 14.1138 14.114C14.6761 13.5517 14.992 12.789 14.992 11.9938V4.9974C14.992 4.20217 14.6761 3.4395 14.1138 2.87719C13.5515 2.31487 12.7888 1.99896 11.9936 1.99896Z"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.9898 9.99512V11.9941C18.9898 13.8496 18.2527 15.6292 16.9406 16.9413C15.6285 18.2533 13.849 18.9904 11.9934 18.9904C10.1379 18.9904 8.35833 18.2533 7.04626 16.9413C5.73419 15.6292 4.99707 13.8496 4.99707 11.9941V9.99512"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.9941 18.9901V21.9886"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "bloggers-covering-caribbean-topics": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.9897 6.99609H3.99798C2.89399 6.99609 1.99902 7.89106 1.99902 8.99506V19.9893C1.99902 21.0933 2.89399 21.9883 3.99798 21.9883H19.9897C21.0937 21.9883 21.9886 21.0933 21.9886 19.9893V8.99506C21.9886 7.89106 21.0937 6.99609 19.9897 6.99609Z"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9909 1.99896L11.9935 6.99637L6.99609 1.99896"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "news-organizations-and-media-outlets": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.9925 17.9902H9.99512"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.991 13.9932H9.99512"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.99798 21.9886H19.9897C20.5198 21.9886 21.0283 21.778 21.4032 21.4031C21.778 21.0282 21.9886 20.5198 21.9886 19.9896V3.99792C21.9886 3.46777 21.778 2.95932 21.4032 2.58444C21.0283 2.20957 20.5198 1.99896 19.9897 1.99896H7.99591C7.46575 1.99896 6.95731 2.20957 6.58243 2.58444C6.20755 2.95932 5.99695 3.46777 5.99695 3.99792V19.9896C5.99695 20.5198 5.78634 21.0282 5.41146 21.4031C5.03659 21.778 4.52814 21.9886 3.99798 21.9886ZM3.99798 21.9886C3.46783 21.9886 2.95938 21.778 2.58451 21.4031C2.20963 21.0282 1.99902 20.5198 1.99902 19.9896V10.9943C1.99902 10.4641 2.20963 9.95569 2.58451 9.58081C2.95938 9.20593 3.46783 8.99533 3.99798 8.99533H5.99695"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9915 5.99688H10.9946C10.4426 5.99688 9.99512 6.44437 9.99512 6.99636V8.99533C9.99512 9.54732 10.4426 9.99481 10.9946 9.99481H16.9915C17.5435 9.99481 17.991 9.54732 17.991 8.99533V6.99636C17.991 6.44437 17.5435 5.99688 16.9915 5.99688Z"
          stroke="#5899E2"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "become-partner-point": (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.7894 9.99437C22.2458 12.2345 21.9205 14.5634 20.8677 16.5927C19.8149 18.622 18.0982 20.2291 16.0039 21.1459C13.9096 22.0627 11.5643 22.2338 9.35911 21.6307C7.15393 21.0276 5.22215 19.6867 3.88593 17.8317C2.54971 15.9767 1.88981 13.7197 2.01629 11.437C2.14277 9.15434 3.04797 6.98402 4.58094 5.28798C6.11392 3.59195 8.182 2.47271 10.4403 2.11691C12.6986 1.76112 15.0107 2.19028 16.9908 3.33283"
          stroke="#FFC400"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.99512 10.9943L11.9936 13.9927L21.9884 3.99792"
          stroke="#FFC400"
          strokeWidth="1.99896"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "free-for-media": (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.3331 16.6655C37.0942 20.4008 36.5518 24.2842 34.7962 27.668C33.0407 31.0517 30.1782 33.7314 26.6861 35.2601C23.1939 36.7888 19.2833 37.0742 15.6062 36.0685C11.9292 35.0629 8.70807 32.827 6.47999 29.7339C4.2519 26.6408 3.15156 22.8773 3.36245 19.071C3.57334 15.2648 5.08272 11.6459 7.63889 8.81784C10.195 5.98978 13.6435 4.12351 17.4091 3.53024C21.1747 2.93697 25.0299 3.65258 28.3318 5.55772"
          stroke="#5899E2"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 18.3321L19.9998 23.3319L36.6656 6.66602"
          stroke="#5899E2"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "verified-content": (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.3331 16.6655C37.0942 20.4008 36.5518 24.2842 34.7962 27.668C33.0407 31.0517 30.1782 33.7314 26.6861 35.2601C23.1939 36.7888 19.2833 37.0742 15.6062 36.0685C11.9292 35.0629 8.70807 32.827 6.47999 29.7339C4.2519 26.6408 3.15156 22.8773 3.36245 19.071C3.57334 15.2648 5.08272 11.6459 7.63889 8.81784C10.195 5.98978 13.6435 4.12351 17.4091 3.53024C21.1747 2.93697 25.0299 3.65258 28.3318 5.55772"
          stroke="#335C81"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.999 18.3321L19.9988 23.3319L36.6646 6.66602"
          stroke="#335C81"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "regional-focus": (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.3331 16.6655C37.0942 20.4008 36.5518 24.2842 34.7962 27.668C33.0407 31.0517 30.1782 33.7314 26.6861 35.2601C23.1939 36.7888 19.2833 37.0742 15.6062 36.0685C11.9292 35.0629 8.70807 32.827 6.47999 29.7339C4.2519 26.6408 3.15156 22.8773 3.36245 19.071C3.57334 15.2648 5.08272 11.6459 7.63889 8.81784C10.195 5.98978 13.6435 4.12351 17.4091 3.53024C21.1747 2.93697 25.0299 3.65258 28.3318 5.55772"
          stroke="#274060"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 18.3321L19.9998 23.3319L36.6656 6.66602"
          stroke="#274060"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "curated-distribution": (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.3331 16.6655C37.0942 20.4008 36.5518 24.2842 34.7962 27.668C33.0407 31.0517 30.1782 33.7314 26.6861 35.2601C23.1939 36.7888 19.2833 37.0742 15.6062 36.0685C11.9292 35.0629 8.70807 32.827 6.47999 29.7339C4.2519 26.6408 3.15156 22.8773 3.36245 19.071C3.57334 15.2648 5.08272 11.6459 7.63889 8.81784C10.195 5.98978 13.6435 4.12351 17.4091 3.53024C21.1747 2.93697 25.0299 3.65258 28.3318 5.55772"
          stroke="#C69500"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.999 18.3321L19.9988 23.3319L36.6646 6.66602"
          stroke="#C69500"
          strokeWidth="3.33317"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "payment-successfull": (
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 63.9951C0 28.6516 28.6516 0 63.9951 0C99.3386 0 127.99 28.6516 127.99 63.9951C127.99 99.3386 99.3386 127.99 63.9951 127.99C28.6516 127.99 0 99.3386 0 63.9951Z"
          fill="#DCFCE7"
        />
        <path
          d="M63.9949 97.3259C82.4029 97.3259 97.3256 82.4032 97.3256 63.9951C97.3256 45.587 82.4029 30.6643 63.9949 30.6643C45.5868 30.6643 30.6641 45.587 30.6641 63.9951C30.6641 82.4032 45.5868 97.3259 63.9949 97.3259Z"
          stroke="#00A63E"
          strokeWidth="6.66616"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M53.9961 63.9953L60.6623 70.6614L73.9946 57.3291"
          stroke="#00A63E"
          strokeWidth="6.66616"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "contact-information": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.826 17.4921V15.8261C15.826 14.9424 15.4749 14.0949 14.8501 13.4701C14.2252 12.8452 13.3777 12.4941 12.494 12.4941H7.49604C6.61234 12.4941 5.76484 12.8452 5.13997 13.4701C4.51511 14.0949 4.16406 14.9424 4.16406 15.8261V17.4921"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.99604 9.16199C11.8362 9.16199 13.328 7.67022 13.328 5.83002C13.328 3.98982 11.8362 2.49805 9.99604 2.49805C8.15584 2.49805 6.66406 3.98982 6.66406 5.83002C6.66406 7.67022 8.15584 9.16199 9.99604 9.16199Z"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "press-release-details": (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.495 1.66602H4.99802C4.55617 1.66602 4.13242 1.84154 3.81999 2.15397C3.50755 2.4664 3.33203 2.89016 3.33203 3.332V16.6599C3.33203 17.1017 3.50755 17.5255 3.81999 17.8379C4.13242 18.1504 4.55617 18.3259 4.99802 18.3259H14.9939C15.4358 18.3259 15.8595 18.1504 16.172 17.8379C16.4844 17.5255 16.6599 17.1017 16.6599 16.6599V5.83098L12.495 1.66602Z"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6621 1.66602V4.99799C11.6621 5.43984 11.8376 5.86359 12.1501 6.17602C12.4625 6.48845 12.8862 6.66398 13.3281 6.66398H16.6601"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.33005 7.49609H6.66406"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.328 10.8281H6.66406"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.328 14.1602H6.66406"
          stroke="#5899E2"
          strokeWidth="1.66599"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "portal-status-live": (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="9"
          cy="9"
          r="6.75"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.75 9L8.25 11.5L12.25 6.5"
          stroke="#059669"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "portal-status-awaiting-payment": (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2.75"
          y="5.25"
          width="12.5"
          height="9.5"
          rx="1.25"
          stroke="#ca8a04"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.75 8.25H15.25"
          stroke="#ca8a04"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 11.25H13.25"
          stroke="#ca8a04"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "portal-status-under-review": (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="9"
          cy="9"
          r="6.75"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6.75H12M6 9H12M6 11.25H9.5"
          stroke="#d97706"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "portal-status-rejected": (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="9"
          cy="9"
          r="6.75"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return icons[icon] ?? null;
}
