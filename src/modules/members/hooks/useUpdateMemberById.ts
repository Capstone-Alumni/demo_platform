import useApi from 'src/modules/share/hooks/useApi';

type UpdateMemberByIdDataParams = {
  memberId: string;
  password: string;
};

type UpdateMemberByIdDataResponse = unknown;

type UpdateMemberByIdDataError = unknown;

const useUpdateMemberById = () => {
  const { fetchApi, isLoading } = useApi<
    UpdateMemberByIdDataParams,
    UpdateMemberByIdDataResponse,
    UpdateMemberByIdDataError
  >('updateMemberById', ({ memberId, password }) => ({
    method: 'PUT',
    url: `/api/members/${memberId}`,
    data: {
      password,
    },
  }));

  return {
    isLoading,
    updateMemberById: fetchApi,
  };
};

export default useUpdateMemberById;
