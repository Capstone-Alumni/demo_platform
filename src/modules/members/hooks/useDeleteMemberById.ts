import useApi from 'src/modules/share/hooks/useApi';

type DeleteMemberByIdDataParams = {
  memberId: string;
};

type DeleteMemberByIdDataResponse = unknown;

type DeleteMemberByIdDataError = unknown;

const useDeleteMemberById = () => {
  const { fetchApi, isLoading } = useApi<
    DeleteMemberByIdDataParams,
    DeleteMemberByIdDataResponse,
    DeleteMemberByIdDataError
  >('deleteMemberById', ({ memberId }) => ({
    method: 'DELETE',
    url: `/api/members/${memberId}`,
  }));

  return {
    isLoading,
    deleteMemberById: fetchApi,
  };
};

export default useDeleteMemberById;
