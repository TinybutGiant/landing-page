import { TOTAL_PAGES } from "../constants";
import { useIntl } from "react-intl";

// 基础 UI 组件接口
export interface UIComponents {
  Button: any;
  Progress: any;
  ChevronLeft?: any;
  ChevronRight?: any;
  Save?: any;
}

interface FormNavigationProps {
  currentPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPreview: () => void;
  onSaveDraft: () => void;
  isSavingDraft: boolean;
  ui: UIComponents;
}

export const FormNavigation = ({
  currentPage,
  onPrevPage,
  onNextPage,
  onGoToPreview,
  onSaveDraft,
  isSavingDraft,
  ui
}: FormNavigationProps) => {
  const intl = useIntl();
  const { Button, Progress, ChevronLeft, ChevronRight, Save } = ui;

  return (
    <div className="space-y-4 pt-6 border-t">
      {/* 进度条和保存按钮一起 */}
      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{intl.formatMessage({ id: 'becomeGuide.progress.pageInfo' }, { current: currentPage, total: TOTAL_PAGES })}</span>
            <span>
              {intl.formatMessage({ id: 'becomeGuide.progress.completion' }, { percentage: Math.round((currentPage / TOTAL_PAGES) * 100) })}
            </span>
          </div>
          <Progress
            value={(currentPage / TOTAL_PAGES) * 100}
            className="h-2"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSavingDraft}
          className="flex items-center gap-2 ml-4"
        >
          {Save && <Save className="h-4 w-4" />}
          {isSavingDraft ? intl.formatMessage({ id: 'becomeGuide.navigation.saving' }) : intl.formatMessage({ id: 'becomeGuide.navigation.saveDraft' })}
        </Button>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {currentPage > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevPage}
              className="flex items-center gap-2"
            >
              {ChevronLeft && <ChevronLeft className="h-4 w-4" />}
              {intl.formatMessage({ id: 'becomeGuide.navigation.previous' })}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentPage < TOTAL_PAGES ? (
            <Button
              type="button"
              onClick={onNextPage}
              className="flex items-center gap-2"
            >
              {intl.formatMessage({ id: 'becomeGuide.navigation.next' })}
              {ChevronRight && <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onGoToPreview}
              className="bg-green-600 hover:bg-green-700"
            >
              {intl.formatMessage({ id: 'becomeGuide.navigation.preview' })}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
