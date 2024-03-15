import React from "react";

/**
 * Generic 과 Memo 를 같이 사용할 경우, 해당 Hoc 를 불러온다.
 *
 * @category Hoc
 */
const WithGenericMemo: <T>(component: T) => T = React.memo;
export default WithGenericMemo;
