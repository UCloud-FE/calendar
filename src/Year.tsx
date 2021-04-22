import React, { memo, useCallback, useContext, useMemo, useState } from 'react';

import YearPanel from 'src/view/YearPanel';
import Header from 'src/view/Header';
import Decade from 'src/Decade';
import CalendarContext, { withContext } from 'src/CalendarContext';
import { SharedCalendarProps, TDate } from 'src/interface';
import useUncontrolled from 'src/useUncontrolled';
import standard from 'src/util/standard';
import classnames from 'src/util/classnames';

type YearProps = SharedCalendarProps;

const Year = ({
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    sidebar,
    className,
    ...rest
}: YearProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Date>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Date>(
        _current,
        defaultCurrent || value || now,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
    const [mode, setMode] = useState('year');
    const onModeChange = useCallback((mode: string) => setMode(mode), []);
    const onDecadeChange = useCallback(
        (current: Date) => {
            onCurrentChange(current);
            setMode('year');
        },
        [onCurrentChange]
    );
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return {
            wrap: prefixCls,
            year: prefixCls + '-year',
            yearWrap: prefixCls + '-year-wrap',
            body: prefixCls + '-body'
        };
    }, [context.prefixCls]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.year, className)}>
            {mode === 'decade' ? (
                <Decade value={standardValue} defaultCurrent={current} onChange={onDecadeChange} />
            ) : (
                <div className={cls.yearWrap}>
                    <Header
                        value={standardCurrent}
                        onChange={onCurrentChange}
                        mode="year"
                        onModeChange={onModeChange}
                    />
                    <div className={cls.body}>
                        <YearPanel
                            value={standardValue === null ? undefined : standardValue}
                            onChange={onChange}
                            current={standardCurrent}
                            onCurrentChange={onCurrentChange}
                        />
                        {sidebar}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withContext<YearProps>(memo(Year));
