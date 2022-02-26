const API_ENDPOINT = 'https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev';

export const request = async (nodeId) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/${nodeId || ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('서버 상태가 이상합니다.')
    }

    const data = response.json();
    return data;
  } catch (err) {
    throw new Error(`에러: ${e.message}`);
  }
}