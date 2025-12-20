import { PrivacyPolicyContent } from '../PrivacyPolicyContent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PrivacyLinkButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center px-4 py-3 border border-muted-foreground rounded-md font-medium text-primary hover:bg-input/30 hover:border-primary transition-colors"
          type="button"
        >
          プライバシーポリシーを見る
        </button>
      </DialogTrigger>
      <DialogContent className="font-shippori-mincho max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            プライバシーポリシー
          </DialogTitle>
        </DialogHeader>
        <PrivacyPolicyContent />
      </DialogContent>
    </Dialog>
  );
}
