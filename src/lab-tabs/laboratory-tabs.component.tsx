import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { type AssignedExtension, Extension, useAssignedExtensions } from '@openmrs/esm-framework';
import { ComponentContext } from '@openmrs/esm-framework/src/internal';
import styles from './laboratory-tabs.scss';
import { useLabOrders } from '../laboratory-resource';

const labPanelSlot = 'lab-panels-slot';

const LaboratoryOrdersTabs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const tabExtensions = useAssignedExtensions(labPanelSlot) as AssignedExtension[];
  const {
    activeOrdersCount,
    workListCount,
    completedTestsCount,
    ordersNotDoneCount,
    approvedOrdersCount,
    referredOutCount,
  } = useOrderCounts();
  const tabsDataCount = [
    { name: 'inprogressPanel', count: activeOrdersCount.length, orders: activeOrdersCount },
    { name: 'worklistPanel', count: workListCount.length, orders: workListCount },
    { name: 'completedPanel', count: completedTestsCount.length, orders: completedTestsCount },
    { name: 'ordersNotDonePanel', count: ordersNotDoneCount.length, orders: ordersNotDoneCount },
    { name: 'approvedPanel', count: approvedOrdersCount.length, orders: approvedOrdersCount },
    { name: 'referredOutPanel', count: referredOutCount.length, orders: referredOutCount },
  ];

  const handleTabChange = (selectedIndex: number) => {
    setSelectedTab(selectedIndex);
  };
  return (
    <main>
      <section>
        <div className={styles.tabs}>
          <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => handleTabChange(selectedIndex)}>
            <TabList style={{ paddingLeft: '1rem' }} aria-label="Laboratory tabs" contained>
              {tabExtensions
                .filter((extension) => Object.keys(extension.meta).length > 0)
                .map((extension, index) => {
                  const { name, title } = extension.meta;
                  if (name && title) {
                    return (
                      <Tab key={index} className={styles.tab} id={`${title || index}-tab`}>
                        {t(title, {
                          ns: extension.moduleName,
                          defaultValue: title,
                        })}
                        {'('}
                        {tabsDataCount.find((tab) => tab.name === name)?.count ?? 0}
                        {')'}
                      </Tab>
                    );
                  } else {
                    return null;
                  }
                })}
            </TabList>
            <TabPanels>
              {tabExtensions
                .filter((extension) => Object.keys(extension.meta).length > 0)
                .map((extension, index) => {
                  return (
                    <TabPanel key={`${extension.meta.title}-tab-${index}`}>
                      <ComponentContext.Provider
                        key={extension.id}
                        value={{
                          moduleName: extension.moduleName,
                          featureName: 'laboratory',
                          extension: {
                            extensionId: extension.id,
                            extensionSlotName: labPanelSlot,
                            extensionSlotModuleName: extension.moduleName,
                          },
                        }}
                      >
                        <Extension />
                      </ComponentContext.Provider>
                    </TabPanel>
                  );
                })}
            </TabPanels>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

const useOrderCounts = () => {
  const { labOrders: activeOrdersCount } = useLabOrders('NEW');
  const { labOrders: workListCount } = useLabOrders('IN_PROGRESS');
  const { labOrders: completedTestsCount } = useLabOrders('COMPLETED');
  const { labOrders: referredOutCount } = useLabOrders('EXCEPTION');
  const { labOrders: ordersNotDoneCount } = useLabOrders('DECLINED');
  const { labOrders: approvedOrdersCount } = useLabOrders('COMPLETED');
  return {
    activeOrdersCount,
    workListCount,
    completedTestsCount,
    ordersNotDoneCount,
    approvedOrdersCount,
    referredOutCount,
  };
};

export default LaboratoryOrdersTabs;
