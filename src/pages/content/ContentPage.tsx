// import React, { useState } from "react";
// import { Button } from "../../components/ui/button";
// import { PanelLeftOpen } from "lucide-react";

// // Components
// import { ContentHistorySidebar } from "./components/ContentHistorySidebar";
// import { ContentGeneratorDialog } from "./components/ContentGeneratorDialog";
// import { ContentWelcomeScreen } from "./components/ContentWelcomeScreen";
// import { SlideNavigator } from "./components/SlideNavigator";
// import { SlideDisplay } from "./components/SlideDisplay";
// import type { Slide, ContentHistory } from "@/types/content.types";
// import { useContentGeneration } from "@/hooks/useContent";
// import { useContentStore } from "@/store";

// const ContentPage: React.FC = () => {
//   // --- Content Configuration State ---
//   const [topic, setTopic] = useState("");
//   const [numberOfSlides, setNumberOfSlides] = useState<number>(5);
//   const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

//   // --- Active Content State ---
//   const [slides, setSlides] = useState<Slide[]>([]);
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//   const [contentTitle, setContentTitle] = useState("");
//   const [contentId, setContentId] = useState("");
//   const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false);

//   // --- Services & Store ---
//   const contentMutation = useContentGeneration();
//   const {
//     addContentToHistory,
//     toggleHistorySidebar,
//     isHistorySidebarOpen,
//     setHistorySidebarOpen,
//     contentHistory,
//   } = useContentStore();

//   // --- Handlers ---

//   const handleGenerateContent = async () => {
//     if (!topic.trim()) {
//       alert("Please enter a topic");
//       return;
//     }

//     try {
//       const response = await contentMutation.mutateAsync({
//         topic: topic.trim(),
//         num_slides: numberOfSlides,
//         teacherId: selectedTeacherId || undefined,
//       });

//       if (response.success && response.slides) {
//         setSlides(response.slides);
//         setContentTitle(response.title);
//         setContentId(response.id);
//         setCurrentSlideIndex(0);
//         setIsGeneratorDialogOpen(false);
//       }
//     } catch (error) {
//       console.error("Failed to generate content:", error);
//     }
//   };

//   const handleNextSlide = () => {
//     if (currentSlideIndex < slides.length - 1) {
//       setCurrentSlideIndex(currentSlideIndex + 1);
//     }
//   };

//   const handlePreviousSlide = () => {
//     if (currentSlideIndex > 0) {
//       setCurrentSlideIndex(currentSlideIndex - 1);
//     }
//   };

//   const handleSlideSelect = (index: number) => {
//     setCurrentSlideIndex(index);
//   };

//   const handleViewPreviousContent = (content: ContentHistory) => {
//     setContentTitle(content.title);
//     setContentId(content.id);
//     setSlides(content.slides);
//     setCurrentSlideIndex(0);
//     setTopic(content.topic);
//   };

//   const handleResetContent = () => {
//     setSlides([]);
//     setContentTitle("");
//     setContentId("");
//     setTopic("");
//     setCurrentSlideIndex(0);

//     // Save to history before resetting
//     if (slides.length > 0 && contentId) {
//       const contentHistoryEntry: ContentHistory = {
//         id: contentId,
//         title: contentTitle,
//         topic,
//         totalSlides: slides.length,
//         createdAt: new Date().toISOString(),
//         slides,
//       };

//       addContentToHistory(contentHistoryEntry);
//     }
//   };

//   const getCurrentContentStatus = () => {
//     if (slides.length === 0) return null;
//     return {
//       title: contentTitle,
//       slideCount: slides.length,
//     };
//   };

//   const handleOpenGeneratorDialog = () => {
//     setIsGeneratorDialogOpen(true);
//   };

//   const handleViewHistory = () => {
//     setHistorySidebarOpen(true);
//   };

//   return (
//     <div className="flex h-full w-full relative bg-background">
//       {/* Sidebar for Content History */}
//       <ContentHistorySidebar
//         onSelectContent={handleViewPreviousContent}
//         currentContent={getCurrentContentStatus()}
//       />

//       {/* Toggle Button when Sidebar is Closed */}
//       {!isHistorySidebarOpen && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={toggleHistorySidebar}
//           className="absolute left-4 top-4 z-10 h-9 w-9 p-0 bg-secondary/50 backdrop-blur-sm shadow-sm hover:bg-secondary/70 border-muted/30"
//         >
//           <PanelLeftOpen className="w-5 h-5 text-foreground" />
//         </Button>
//       )}

//       {/* Main Content Area */}
//       <div className="flex-1 bg-background h-full">
//         <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-12 h-full">
//           {/* Content Generator Dialog */}
//           <ContentGeneratorDialog
//             open={isGeneratorDialogOpen}
//             onOpenChange={setIsGeneratorDialogOpen}
//             topic={topic}
//             setTopic={setTopic}
//             numberOfSlides={numberOfSlides}
//             setNumberOfSlides={setNumberOfSlides}
//             selectedTeacherId={selectedTeacherId}
//             setSelectedTeacherId={setSelectedTeacherId}
//             onGenerate={handleGenerateContent}
//             onViewHistory={handleViewHistory}
//             isPending={contentMutation.isLoading}
//             isError={contentMutation.isError}
//           />

//           {/* Welcome Screen - shown when no content is active */}
//           {!slides.length && (
//             <div className="animate-in fade-in zoom-in duration-300">
//               <ContentWelcomeScreen
//                 onStartGeneration={handleOpenGeneratorDialog}
//                 onViewHistory={handleViewHistory}
//                 hasHistory={contentHistory.length > 0}
//               />
//             </div>
//           )}

//           {/* Content Interface */}
//           {slides.length > 0 && (
//             <div className="animate-in fade-in duration-500">
//               {/* Content Title */}
//               <div className="mb-8">
//                 <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//                   {contentTitle}
//                 </h1>
//                 <p className="text-muted-foreground">
//                   {slides.length} slides on {topic}
//                 </p>
//               </div>

//               <div className="flex flex-col lg:flex-row gap-8 items-start">
//                 {/* Slide Navigator (Left on Desktop, Top on Mobile) */}
//                 <div className="order-2 lg:order-1 w-full lg:w-auto">
//                   <SlideNavigator
//                     slides={slides}
//                     currentSlideIndex={currentSlideIndex}
//                     onSelectSlide={handleSlideSelect}
//                     onReset={handleResetContent}
//                   />
//                 </div>

//                 {/* Main Slide Display */}
//                 <div className="order-1 lg:order-2 flex-1 w-full">
//                   {slides[currentSlideIndex] && (
//                     <SlideDisplay
//                       slide={slides[currentSlideIndex]}
//                       currentSlideIndex={currentSlideIndex}
//                       totalSlides={slides.length}
//                       onNext={handleNextSlide}
//                       onPrevious={handlePreviousSlide}
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContentPage;
import React, { useCallback, useState } from 'react';
import { Button } from '../../components/ui/button';
import { PanelLeftOpen } from 'lucide-react';

import { ContentHistorySidebar } from './components/ContentHistorySidebar';
import { ContentGeneratorDialog } from './components/ContentGeneratorDialog';
import { ContentWelcomeScreen } from './components/ContentWelcomeScreen';
import { SlideNavigator } from './components/SlideNavigator';
import { SlideDisplay } from './components/SlideDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentIngestionTab } from './components/ContentIngestionTab';
import { ImageLibraryTab } from './components/ImageLibraryTab';
import { useAllCoursesMetadata, useContentGeneration } from '@/hooks/useContent';
import { useContentStore } from '@/store';

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'add' | 'images'>('generate');
  const [topic, setTopic] = useState('');
  const [numberOfSlides, setNumberOfSlides] = useState(5);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [contentTitle, setContentTitle] = useState('');
  const [contentId, setContentId] = useState('');
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false);

  const {
    toggleHistorySidebar,
    isHistorySidebarOpen,
    setHistorySidebarOpen,
  } = useContentStore();

  const contentMutation = useContentGeneration();
  const { data: courses = [] } = useAllCoursesMetadata();

  // ─── KEY FIX: this is async and drives isPending on the mutation ──────────
  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    if (!selectedTeacherId) {
      alert('Please select a teacher before generating content.');
      return;
    }

    try {
      // mutateAsync drives isPending = true while awaiting
      const response = await contentMutation.mutateAsync({
        topic: topic.trim(),
        num_slides: numberOfSlides,
        teacherId: selectedTeacherId || undefined,
      });

      if (response?.success && Array.isArray(response.slides)) {
        setSlides(response.slides);
        setContentTitle(response.title);
        setContentId(response.id);
        setCurrentSlideIndex(0);
        setIsGeneratorDialogOpen(false); // close only on success

      }
    } catch {
      // isError on the mutation is set automatically — dialog shows the error UI
    }
  };

  const handleViewPreviousContent = useCallback((content) => {
    setContentTitle(content.title);
    setContentId(content.id);
    setSlides(content.slides);
    setCurrentSlideIndex(0);
    setTopic(content.topic || content.title);
    setHistorySidebarOpen(false);
  }, [setHistorySidebarOpen]);

  const handleResetContent = () => {
    setSlides([]);
    setContentTitle('');
    setContentId('');
    setTopic('');
    setCurrentSlideIndex(0);
  };

  const getCurrentContentStatus = () => {
    if (!slides.length) return null;
    return { title: contentTitle, slideCount: slides.length };
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as 'generate' | 'add' | 'images')}
      className="flex h-full w-full relative bg-background"
    >
      {(activeTab === 'generate' || activeTab === 'images') && (
        <>
          <ContentHistorySidebar
            onSelectContent={handleViewPreviousContent}
            currentContent={getCurrentContentStatus()}
          />

          {!isHistorySidebarOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHistorySidebar}
              className="absolute left-4 top-4 z-10 h-9 w-9 p-0 bg-secondary/50 backdrop-blur-sm shadow-sm hover:bg-secondary/70 border-muted/30"
            >
              <PanelLeftOpen className="w-5 h-5 text-foreground" />
            </Button>
          )}
        </>
      )}

      <div className="flex-1 bg-background h-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-12 h-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="generate">Generate Content</TabsTrigger>
              <TabsTrigger value="add">Add Content</TabsTrigger>
              <TabsTrigger value="images">Add Images</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate">
            {/* Pass handleGenerateContent directly as onGenerate
                The dialog calls it on button click — isPending flips immediately */}
            <ContentGeneratorDialog
              open={isGeneratorDialogOpen}
              onOpenChange={setIsGeneratorDialogOpen}
              topic={topic}
              setTopic={setTopic}
              numberOfSlides={numberOfSlides}
              setNumberOfSlides={setNumberOfSlides}
              selectedTeacherId={selectedTeacherId}
              setSelectedTeacherId={setSelectedTeacherId}
              onGenerate={handleGenerateContent}
              onViewHistory={() => setHistorySidebarOpen(true)}
              isPending={contentMutation.isLoading}
              isError={contentMutation.isError}
              errorMessage={contentMutation.error?.message}
            />

            {!slides.length && (
              <div className="animate-in fade-in zoom-in duration-300">
                <ContentWelcomeScreen
                  onStartGeneration={() => setIsGeneratorDialogOpen(true)}
                  onViewHistory={() => setHistorySidebarOpen(true)}
                  hasHistory={courses.length > 0}
                />
              </div>
            )}

            {slides.length > 0 && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {contentTitle}
                  </h1>
                  <p className="text-muted-foreground">
                    {slides.length} slides · {topic}
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="order-2 lg:order-1 w-full lg:w-auto">
                    <SlideNavigator
                      slides={slides}
                      currentSlideIndex={currentSlideIndex}
                      onSelectSlide={setCurrentSlideIndex}
                      onReset={handleResetContent}
                    />
                  </div>
                  <div className="order-1 lg:order-2 flex-1 w-full">
                    {slides[currentSlideIndex] && (
                      <SlideDisplay
                        slide={slides[currentSlideIndex]}
                        currentSlideIndex={currentSlideIndex}
                        totalSlides={slides.length}
                        onNext={() =>
                          setCurrentSlideIndex((i) =>
                            Math.min(i + 1, slides.length - 1)
                          )
                        }
                        onPrevious={() => setCurrentSlideIndex((i) => Math.max(i - 1, 0))}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="animate-in fade-in duration-300">
              <ContentIngestionTab />
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="animate-in fade-in duration-300">
              <ImageLibraryTab />
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default ContentPage;
