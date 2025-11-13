import styled from 'styled-components'

export default function NewsCard({data}) {
  const toNews = () => {
  window.open(`${data.url}`,'_blank');
};
  return (
    <Box onClick={()=>toNews()}>
      <NewsBox >
        <NewsTitle>{data.title}</NewsTitle>
        <NewsSource>{data.source_name || data.sourceName}</NewsSource>
      </NewsBox>
      <NewsImg src={data.image_url || data.imageUrl}/>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--Spacing-L, 16px);
  align-self: stretch;
  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  width: 343px;
  height: 112px;

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  :hover{
    cursor: pointer;
  }
`
const NewsBox = styled.div`
  display: flex;
  flex-direction: column;
`
const NewsTitle = styled.div`
  color: var(--Neutral-900, #333);
  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  width: 215px;
  /* 2. 필수: 텍스트를 두 줄로 제한 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 두 줄로 제한 */
  -webkit-box-orient: vertical;
  /* 필수: 넘치는 내용을 숨김 */
  overflow: hidden; 
  /* 필수: 숨겨진 부분 대신 말줄임표(...) 표시 */
  text-overflow: ellipsis; 
  
  /* 너비를 지정해야 잘리는 부분이 생깁니다. */
  max-width: 215px; /* 예시 너비 */
`
const NewsSource = styled.div`
  color: var(--Neutral-300, #b0b0b0);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const NewsImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-900, #263c54);
`
