"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PhotoGrid from "@/components/PhotoGrid";
import ImageModal from "@/components/ImageModal";
import Footer from "@/components/Footer";

// ============================================
// 여기를 수정하세요! (개인 정보)
// ============================================
const myInfo = {
  name: "신유하",
  tagline: "여행을 좋아하는 기획자입니다",
  email: "hello@example.com",
  greeting: "안녕하세요!",
  description:
    "저는 새로운 곳을 탐험하고 사진으로 기록하는 것을 좋아합니다. 이 사이트는 제가 직접 만든 첫 번째 웹사이트입니다. Next.js와 Tailwind CSS로 만들었습니다.",
  highlights: ["여행 사진 촬영", "새로운 음식 탐험", "웹 개발 배우기"],
  socialLinks: {
    instagram: "https://instagram.com",
    github: "https://github.com",
  },
};

// ============================================
// 이미지 설정 (Unsplash 샘플 이미지 사용)
// 나중에 public 폴더에 본인 사진을 넣고 경로를 바꾸세요
// 예: "/my-photo.jpg"
// ============================================
const images = {
  hero: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  profile:
    "https://images.unsplash.com/photo-1775315815915-43af175d4c95?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8?w=600&q=80",
  travel: [
    {
      src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      alt: "일본 교토",
      caption: "일본 교토의 아름다운 거리",
    },
    {
      src: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
      alt: "프랑스 파리",
      caption: "파리 에펠탑 앞에서",
    },
    {
      src: "https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=800&q=80",
      alt: "이탈리아 베니스",
      caption: "베니스의 운하",
    },
    {
      src: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      alt: "스페인 바르셀로나",
      caption: "사그라다 파밀리아 성당",
    },
    {
      src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
      alt: "그리스 산토리니",
      caption: "산토리니의 하얀 집들",
    },
    {
      src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
      alt: "일본 도쿄",
      caption: "도쿄의 밤거리",
    },
  ],
  photos: [
    {
      src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      alt: "맛있는 음식",
      caption: "여행 중 만난 맛집",
    },
    {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      alt: "풍경 사진",
      caption: "아름다운 자연",
    },
    {
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
      alt: "산",
      caption: "겨울 산의 풍경",
    },
  ],
};

// ============================================
// 메인 페이지 컴포넌트
// ============================================
export default function Home() {
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  const handlePhotoClick = (photo: {
    src: string;
    alt: string;
    caption?: string;
  }) => {
    setModalImage(photo);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection
        name={myInfo.name}
        tagline={myInfo.tagline}
        backgroundImage={images.hero}
      />

      <AboutSection
        profileImage={images.profile}
        greeting={myInfo.greeting}
        description={myInfo.description}
        highlights={myInfo.highlights}
      />

      <PhotoGrid
        id="travel"
        title="Travel"
        subtitle="제가 다녀온 여행지들입니다"
        photos={images.travel}
        onPhotoClick={handlePhotoClick}
      />

      <div className="bg-white">
        <PhotoGrid
          id="photos"
          title="Photos"
          subtitle="일상의 순간들"
          photos={images.photos}
          onPhotoClick={handlePhotoClick}
        />
      </div>

      <Footer
        name={myInfo.name}
        email={myInfo.email}
        socialLinks={myInfo.socialLinks}
      />

      <ImageModal
        isOpen={modalImage !== null}
        imageSrc={modalImage?.src || ""}
        imageAlt={modalImage?.alt || ""}
        caption={modalImage?.caption}
        onClose={handleCloseModal}
      />
    </div>
  );
}
