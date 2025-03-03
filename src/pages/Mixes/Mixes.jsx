import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Aside from "../../components/aside/Aside";
import { useGetVideosQuery } from "../../app/service/posts";
import { Post } from "../../components/post/Post";
import { setPhoto } from "../../utils/setPhoto";
import { useCurrentUserQuery } from "../../app/service/user";
import { HumanizeDate } from "../../utils/HumanizeDate";
import Loader from "../../components/loader/Loader";

import "swiper/css";
import "./Mixes.scss";

const Mixes = () => {
  const [reversedData, setReversedData] = useState([]);

  const user = useCurrentUserQuery();
  const videos = useGetVideosQuery();

  const [swiper, setSwiper] = useState();

  useEffect(() => {
    if (videos.data) {
      const arr = [];

      videos?.data?.forEach((el) => {
        arr.unshift(el);
      });

      setReversedData(arr);
    }
  }, [videos]);

  const onHandleWheel = (e) => {
    if (e.deltaY > 0) {
      swiper.slideNext();
    } else {
      swiper.slidePrev();
    }
  };

  if (videos.isLoading || !reversedData) {
    return <Loader />;
  }

  return (
    <div className="mixes">
      <Aside open={true} />
      <div className="wrapper" onWheel={onHandleWheel}>
        <Swiper
          onSwiper={setSwiper}
          className="mixes__swiper"
          direction={"vertical"}
          mousewheel={{ enabled: false }}
        >
          {reversedData.map((post) => (
            <SwiperSlide className="mixes__swiper-slide">
              <Post
                height={"95vh"}
                isMix
                key={post?.id}
                id={post?.id}
                userId={post?.userId}
                url={`${process.env.REACT_APP_SERVER_URL}/${post?.photo}`}
                profileURL={setPhoto(post?.userPhoto)}
                description={post?.description}
                likes={post?.likesCount}
                name={post?.name}
                self={user.data.id === post?.userId}
                status={post?.status}
                date={HumanizeDate(post?.publishedAt)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mixes__swiper-arrows">
          <button
            className="mixes__swiper-prev mixes__swiper-arrow"
            onClick={() => swiper.slidePrev()}
          >
            <img
              style={{ transform: "rotate(180deg)" }}
              src="https://img.icons8.com/?size=100&id=89221&format=png&color=000000"
              alt=""
            />
          </button>
          <button
            className="mixes__swiper-next mixes__swiper-arrow"
            onClick={() => swiper.slideNext()}
          >
            <img
              src="https://img.icons8.com/?size=100&id=89221&format=png&color=000000"
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mixes;
