import dynamic from "next/dynamic";
export default dynamic(() => import("./login.impl"), { ssr: false });
