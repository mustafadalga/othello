import { useRef } from 'react';
import { isEqual, cloneDeep } from 'lodash';

const useDeepCompareMemoize = <T>(value: T): T => {
    const ref = useRef<T>();

    if (!isEqual(value, ref.current)) {
        ref.current = cloneDeep(value);
    }

    return ref.current!;
};

export default useDeepCompareMemoize;
