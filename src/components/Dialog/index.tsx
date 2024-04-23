import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import Editor from '../Editor';
import { ReactNode } from 'react';
type Props = {
  buttonText: ReactNode;
  onClickbuttonText?: () => void;
  title: string;
  description: string;
  content: ReactNode;
  actionText: string;
  onClickActionText?: () => void;
};
export function CustomDialog({
  buttonText,
  onClickbuttonText,
  title,
  description,
  actionText,
  content,
  onClickActionText,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={onClickbuttonText}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[50%] max-h-[80%]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{content}</div>
        <DialogFooter>
          <Button type="submit" onClick={onClickActionText}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
