'use client';
import React, { useEffect, useState } from 'react';
import { BadgePlus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { queryClient } from '@/providers/react-query-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCreateStudentMutation } from '@/hooks/student/useCreateStudentMudation';
import { ClassCombobox } from './classCombobox/ClassCombobox';
import { useEditStudentAtom } from '@/hooks/student/useEditStudentAtom';
import { useEditStudentMudation } from '@/hooks/student';
const createSchema = (editMode: boolean) => {
  return z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    userName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    classroomId: z.optional(z.string()),
  });
};

type createSchemaReturnType = ReturnType<typeof createSchema>;
type createStudentmType = z.infer<createSchemaReturnType>;

const AddStudent = ({ className }: { className?: string }) => {
  const [student, setStudent] = useEditStudentAtom();

  const defaultValues = {
    email: '' || student?.user?.email,
    firstName: '' || student?.user?.first_name,
    lastName: '' || student?.user?.last_name,
    password: '',
    userName: '' || student?.user?.user_name,
    classroomId:
      undefined || student?.classroom?.classroom_id.toString() || '0',
  };
  const { mutate: createStudent, isPending: createPending } =
    useCreateStudentMutation({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        setOpen(false);
        setStudent(null);
        toast?.success('Student add Successfully');
      },
      onError(error) {
        toast?.error(error?.message.split(':')[0]);
      },
    });
  const { mutate: editStudent, isPending: editPending } =
    useEditStudentMudation({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['students'] });
        setOpen(false);
        setStudent(null);
        toast?.success('Student add Successfully');
      },
      onError(error) {
        toast?.error(error?.message.split(':')[0]);
      },
    });

  const schema = createSchema(student?.action === 'EDIT');

  const methods = useForm<createStudentmType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: createStudentmType) => {
    const classroom = !!data?.classroomId && {
      classroom_id: +data?.classroomId,
    };

    if (student?.action === 'EDIT') {
      editStudent({
        student_id: student?.student_id,
        email: data?.email,
        first_name: data?.firstName,
        last_name: data?.lastName,
        password: data?.password,
        user_name: data?.userName,
        ...classroom,
      });
      return;
    }

    createStudent({
      email: data?.email,
      first_name: data?.firstName,
      last_name: data?.lastName,
      password: data?.password,
      user_name: data?.userName,
      ...classroom,
    });
  };
  const onError = (error) => {
    console.log(error);
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (student?.action === 'EDIT') {
      setOpen(true);
      methods?.reset({
        email: student?.user?.email,
        firstName: student?.user?.first_name,
        lastName: student?.user?.last_name,
        password: '',
        userName: student?.user?.user_name,
        classroomId: student?.classroom?.classroom_id.toString() || '0',
      });
    }
  }, [student?.action]);
  console.log(student);

  return (
    <div className={className}>
      <Sheet
        open={open}
        onOpenChange={(open) => {
          setStudent(null);
          setOpen(open);
          methods?.reset(defaultValues);
        }}
      >
        <SheetTrigger asChild>
          <Button variant="outline">
            <BadgePlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </SheetTrigger>
        <SheetContent className="min-w-[25%]">
          <SheetHeader>
            <SheetTitle> Add Student</SheetTitle>
            <SheetDescription>
              Fill in the details to create a new Student.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
                <div className="space-y-2 ">
                  <Label htmlFor="firstName">First name*</Label>
                  <Input id="firstName" name="firstName" />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="lastName">Last name*</Label>
                  <Input id="lastName" name="lastName" />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="userName">User name*</Label>
                  <Input id="userName" name="userName" />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="email">Email*</Label>
                  <Input id="email" name="email" />
                </div>

                <div className="space-y-2 ">
                  <Label htmlFor="password">Password*</Label>
                  <Input id="password" name="password" />
                </div>

                <div className="space-y-2 flex flex-col pt-5">
                  <Label>Classroom</Label>
                  <ClassCombobox />
                </div>

                <SheetFooter className="pt-10">
                  <Button
                    type="submit"
                    className="min-w-16"
                    isPending={createPending || editPending}
                  >
                    ADD
                  </Button>
                </SheetFooter>
              </form>
            </FormProvider>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddStudent;
