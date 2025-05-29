import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ActionBottomSheet, ActionSheetOption } from '@/components/common/ActionBottomSheet';

interface ActionSheetProps {
  options: ActionSheetOption[];
  onSelect?: (key: string) => void;
  onClose?: () => void;
}

type SheetType = null | 'action';

type BottomSheetContextProps = {
  open: (type: SheetType, props: ActionSheetProps) => void;
  close: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextProps | undefined>(undefined);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [sheetProps, setSheetProps] = useState<any>({});

  const open = (type: SheetType, props: ActionSheetProps) => {
    setSheetType(type);
    setSheetProps(props);
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 0);
  };

  const close = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setSheetType(null);
      setSheetProps({});
    }, 300);
  };

  return (
    <BottomSheetContext.Provider value={{ open, close }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        backgroundStyle={{ backgroundColor: '#262626' }}
        handleIndicatorStyle={{ backgroundColor: '#444545' }}
        backdropComponent={props => (
          <BottomSheetBackdrop {...props} pressBehavior="close" appearsOnIndex={0} disappearsOnIndex={-1}  />
        )}
      >
        <BottomSheetScrollView>
          {sheetType === 'action' && (
            <ActionBottomSheet {...sheetProps} onClose={close} />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error('useBottomSheet 必須在 BottomSheetProvider 內使用');
  return ctx;
}; 