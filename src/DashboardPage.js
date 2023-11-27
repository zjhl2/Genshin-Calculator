import React, { useState, useEffect } from 'react';
import 'antd/dist/reset.css';
import { Radio, Input, Button, Table, Select } from 'antd';

const { Column } = Table;
const { Option } = Select;

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
};

const contentContainerStyle = {
    display: 'flex',
    flexDirection: 'column', // 垂直排列
    alignItems: 'center',
    textAlign: 'center',
};

const tableContainerStyle = {
    display: 'flex',
    flexDirection: 'column', // 垂直排列
    alignItems: 'center',
    width: '100%', // 设置宽度为100%以充满父容器
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
};
function DashboardPage() {
    const [tableData, setTableData] = useState([
        { id: 0, name: "暴击率", content: '70', step: 3.5 },
        { id: 1, name: "暴击伤害", content: '140', step: 7.0 },
        { id: 2, name: "元素精通", content: '100', step: 21 },
        { id: 3, name: "攻击力", content: '2000', step: 5.3 },
        { id: 4, name: "生命值", content: '30000', step: 5.3 },
        { id: 5, name: "基础攻击力", content: '1000', step: 0 }, // 这里基础攻击力的 step 设置为 0
        { id: 6, name: "基础生命值", content: '15000', step: 0 }, // 这里基础生命值的 step 设置为 0
        { id: 7, name: "倍率", content: '1', step: 0 }, // 这里倍率的 step 设置为 0
    ]);

    const handleInputChange = (value, id) => {
        const regex = /^\d+(\.\d{0,2})?$/;
        if (!regex.test(value) && value !== '') {
            return;
        }

        const updatedTableData = tableData.map((item) =>
            item.id === id ? { ...item, content: value } : item
        );
        setTableData(updatedTableData);
    };

    useEffect(() => {
        calculateDmg();
    }, [tableData]);

    const [calculationMode, setCalculationMode] = useState('ATK'); // 默认使用ATK计算
    const [damageMultiplier, setDamageMultiplier] = useState('无'); // 默认选择'无'

    const handleModeChange = (e) => {
        setCalculationMode(e.target.value);
    };

    const handleMultiplierChange = (value) => {
        setDamageMultiplier(value);
    };

    const [expectDmg, setExpectDmg] = useState(0);
    const [critDmg, setCritDmg] = useState(0);
    const [direct, setDirect] = useState(0);
    const [element, setElement] = useState(0);

    const calculateDmg = () => {
        const CRITRate = parseFloat(tableData[0].content);
        const CRITDMG = parseFloat(tableData[1].content);
        const ElementalMastery = parseFloat(tableData[2].content);
        let ATK = parseFloat(tableData[3].content);
        let MaxHP = parseFloat(tableData[4].content);
        const baseATK = parseFloat(tableData[5].content);
        const baseHP = parseFloat(tableData[6].content);
        const percent = parseFloat(tableData[7].content);

        const attributeToUse = calculationMode === 'ATK' ? ATK : MaxHP;

        ATK = baseATK * (1 + (ATK - 100) / 100);
        MaxHP = baseHP * (1 + (MaxHP - 100) / 100);

        let expectDmg = 0;
        let critDmg = 0;
        let direct = 0;
        let element = 0;
        let critExpectv = 1 + CRITRate / 100 * CRITDMG / 100;
        let emv = 1;
        if (ElementalMastery > 0) {
            emv += 2.78 / (1 + 1400 / ElementalMastery);
        }
        expectDmg = attributeToUse * percent * critExpectv;
        critDmg = attributeToUse * percent * (1 + CRITDMG / 100);
        setDirect(0);
        setElement(0);
        if (damageMultiplier === "1.5蒸发融化") {
            expectDmg *= 1.5 * emv;
            critDmg *= 1.5 * emv;
        }
        if (damageMultiplier === "2.0蒸发融化") {
            expectDmg *= 2 * emv;
            critDmg *= 2 * emv;
        }
        if (damageMultiplier === "1.15超激化90级") {
            expectDmg = (attributeToUse * percent + 1447 * 1.15 * emv) * critExpectv;
            critDmg = (attributeToUse * percent + 1447 * 1.15 * emv) * (1 + CRITDMG / 100);
            direct = attributeToUse * percent / ((attributeToUse * percent + 1447 * 1.15 * emv));
            element = 1 - direct;
        }
        if (damageMultiplier === "1.25蔓激化90级") {
            expectDmg = (attributeToUse * percent + 1447 * 1.25 * emv) * critExpectv;
            critDmg = (attributeToUse * percent + 1447 * 1.25 * emv) * (1 + CRITDMG / 100);
            direct = attributeToUse * percent / ((attributeToUse * percent + 1447 * 1.25 * emv));
            element = 1 - direct;
        }
        setExpectDmg(Math.floor(expectDmg));
        setCritDmg(Math.floor(critDmg));
        setDirect(Math.floor(direct * 1000));
        setElement(Math.floor(element * 1000));
    };

    const handleButtonClick = (id, adjustment) => {
        const updatedTableData = tableData.map((item) => {
            if (item.id === id) {
                const currentValue = parseFloat(item.content);
                if (!isNaN(currentValue)) {
                    return { ...item, content: (currentValue + adjustment).toFixed(1) };
                }
            }
            return item;
        });
        setTableData(updatedTableData);
    };


    return (
        <div style={containerStyle}>
            <h1>Dashboard Page</h1>
            <div style={contentContainerStyle}>
                <Radio.Group onChange={handleModeChange} value={calculationMode}>
                    <Radio value="ATK">使用ATK计算</Radio>
                    <Radio value="MaxHP">使用MaxHP计算</Radio>
                </Radio.Group>
                <div>
                    <label>反应选择：</label>
                    <Select value={damageMultiplier} onChange={handleMultiplierChange} style={{ width: '150px' }}>
                        <Option value="无">无</Option>
                        <Option value="1.5蒸发融化">1.5蒸发融化</Option>
                        <Option value="2.0蒸发融化">2.0蒸发融化</Option>
                        <Option value="1.15超激化90级">1.15超激化90级</Option>
                        <Option value="1.25蔓激化90级">1.25蔓激化90级</Option>
                    </Select>
                </div>
                <div style={tableContainerStyle}>
                    <Table dataSource={tableData} pagination={false}>
                        <Column title="属性" dataIndex="name" key="name" />
                        <Column
                            title="数值"
                            dataIndex="content"
                            key="content"
                            render={(text, record) => (
                                <Input
                                    value={text}
                                    onChange={(e) => handleInputChange(e.target.value, record.id)}
                                />
                            )}
                        />
                        <Column
                            title="调整"
                            key="adjustment"
                            render={(text, record) => (
                                <div style={buttonGroupStyle}>
                                    {record.step !== 0 && (
                                        <>
                                            <Button onClick={() => handleButtonClick(record.id, -record.step)}>
                                                {record.id === 3 || record.id === 4 ? '-' : '-'}
                                                {record.step}
                                                {record.id === 3 || record.id === 4 ? '%' : ''}
                                            </Button>
                                            <Button onClick={() => handleButtonClick(record.id, record.step)}>
                                                {record.id === 3 || record.id === 4 ? '+' : '+'}
                                                {record.step}
                                                {record.id === 3 || record.id === 4 ? '%' : ''}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        />
                    </Table>
                </div>
                <div>
                    <Button onClick={calculateDmg}>计算</Button>
                    {expectDmg !== 0 && <p>期望伤害: {expectDmg}</p>}
                    {critDmg !== 0 && <p>暴击伤害: {critDmg}</p>}
                    {direct !== 0 && <p>直伤占比: {direct / 10}%   激化占比: {element / 10}%</p>}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;