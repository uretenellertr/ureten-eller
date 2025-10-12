import dynamic from "next/dynamic";
export default dynamic(() => import("./post.impl"), { ssr: false });
