'use client';

import { Box, Button, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MemberListTable from './MemberListTable';
import { useState } from 'react';

// import { useRecoilState } from 'recoil';
// import { getMemberListParamsAtom } from '../state';
import useCreateMember from '../hooks/useCreateMember';
import useDeleteMemberById from '../hooks/useDeleteMemberById';
import useUpdateMemberById from '../hooks/useUpdateMemberById';
import useGetMemberList from '../hooks/useGetMemberList';
import LoadingIndicator from '@share/components/LoadingIndicator';
import MemberForm, { MemberFormValues } from './MemberForm';
import { useRecoilState } from 'recoil';
import { getMemberListParamsAtom } from '../state';

const MemberListPage = ({ tenantId }: { tenantId: string }) => {
  const theme = useTheme();
  const [openForm, setOpenForm] = useState(false);

  const [params, setParams] = useRecoilState(getMemberListParamsAtom);

  const { createMember } = useCreateMember();
  const { deleteMemberById } = useDeleteMemberById();
  const { updateMemberById } = useUpdateMemberById();
  const {
    reload,
    data: memberListData,
    isLoading: isGettingMember,
  } = useGetMemberList(tenantId);

  const onAddMember = async (values: MemberFormValues) => {
    await createMember({ ...values, tenantId });
    reload();
  };

  const onDelete = async (memberId: string) => {
    await deleteMemberById({ memberId });
    reload();
  };

  const onUpdate = async (memberId: string, { password }: MemberFormValues) => {
    await updateMemberById({ memberId, password });
    reload();
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: theme.spacing(4),
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3">Thanh vien</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Thêm thanh vien mới
        </Button>
      </Box>

      {openForm ? (
        <MemberForm onSubmit={onAddMember} onClose={() => setOpenForm(false)} />
      ) : null}

      <Box
        sx={{
          width: '100%',
        }}
      >
        {isGettingMember ? <LoadingIndicator /> : null}

        {memberListData?.data ? (
          <MemberListTable
            data={memberListData?.data}
            onDelete={onDelete}
            onEdit={onUpdate}
            page={params.page || 1}
            onChangePage={(nextPage: number) => {
              setParams(prevParams => ({ ...prevParams, page: nextPage }));
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default MemberListPage;
