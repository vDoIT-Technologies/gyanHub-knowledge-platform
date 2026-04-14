// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { 
//   BookOpen, 
//   PanelLeftClose, 
//   Trash2, 
//   Calendar,
//   FileText
// } from 'lucide-react';
// import type { ContentHistory } from '@/types/content.types';
// import { useContentStore } from '@/store';

// interface ContentHistorySidebarProps {
//   onSelectContent: (content: ContentHistory) => void;
//   currentContent?: {
//     title: string;
//     slideCount: number;
//   } | null;
// }

// export const ContentHistorySidebar: React.FC<ContentHistorySidebarProps> = ({ 
//   onSelectContent, 
//   currentContent 
// }) => {
//   const { 
//     contentHistory, 
//     isHistorySidebarOpen, 
//     clearContentHistory,
//     toggleHistorySidebar 
//   } = useContentStore();

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   if (!isHistorySidebarOpen) return null;

//   return (
//     <>
//       {/* Mobile overlay backdrop */}
//       <div
//         className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//         onClick={toggleHistorySidebar}
//       />
//       <div className="fixed inset-y-0 left-0 z-40 w-[85vw] max-w-80 lg:relative lg:z-auto lg:w-80 h-full flex flex-col bg-secondary/50 backdrop-blur-sm border-r border-muted/30 flex-shrink-0 transition-all duration-300">
//       <div className="p-4 border-b border-muted/30 flex items-center justify-between bg-secondary/70">
//         <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
//           History
//         </h2>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={toggleHistorySidebar}
//           className="h-8 w-8 p-0 hover:bg-muted/20"
//         >
//           <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
//         </Button>
//       </div>

//       <ScrollArea className="flex-1 p-4">
//         {/* Current Content Info */}
//         {currentContent && (
//           <div className="mb-6 animate-in slide-in-from-left-2 duration-300">
//             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Session</h3>
//             <Card className="p-4 border-primary/30 bg-primary/10 shadow-sm backdrop-blur-sm">
//               <div className="flex flex-col gap-2">
//                 <div className="flex justify-between items-start">
//                   <h4 className="font-semibold text-primary line-clamp-2">{currentContent.title}</h4>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-primary/80">
//                   <FileText className="w-3 h-3" />
//                   <span>{currentContent.slideCount} Slides</span>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         )}

//         {/* Previous Content */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Previous Content</h3>
//             {contentHistory.length > 0 && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={clearContentHistory}
//                 className="h-6 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2"
//               >
//                 <Trash2 className="w-3 h-3 mr-1" />
//                 Clear
//               </Button>
//             )}
//           </div>

//           {contentHistory.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground/50">
//               <BookOpen className="w-12 h-12 mb-3 opacity-20" />
//               <p className="text-sm">No history yet.</p>
//               <p className="text-xs">Generate content to save it here.</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {contentHistory.map((content) => (
//                 <div
//                   key={content.id}
//                   className="group relative bg-muted/10 rounded-xl p-3 border border-muted/30 shadow-sm hover:shadow-md hover:border-primary/40 hover:bg-muted/20 transition-all cursor-pointer backdrop-blur-sm"
//                   onClick={() => onSelectContent(content)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <h4 className="font-semibold text-sm text-foreground line-clamp-2 pr-2">
//                       {content.title}
//                     </h4>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs text-muted-foreground">
//                     <div className="flex items-center gap-1.5">
//                       <FileText className="w-3.5 h-3.5 text-muted-foreground/70" />
//                       <span>{content.totalSlides} slides</span>
//                     </div>
//                     <div className="col-span-2 flex items-center gap-1.5 mt-1 pt-1 border-t border-muted/20 text-muted-foreground/70">
//                       <Calendar className="w-3.5 h-3.5" />
//                       <span>{formatDate(content.createdAt)}</span>
//                     </div>
//                   </div>
                  
//                   {/* Hover effect indicator */}
//                   <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </ScrollArea>
//     </div>
//     </>
//   );
// };
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  PanelLeftClose,
  Calendar,
  FileText,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useContentStore } from '@/store';
import {
  useAllCoursesMetadata,
  useDeleteCourse,
  useDocumentById,
} from '@/hooks/useContent';
import type { ContentHistory } from '@/types/content.types';

export const ContentHistorySidebar = ({ onSelectContent, currentContent }) => {
  const { isHistorySidebarOpen, toggleHistorySidebar, setHistorySidebarOpen } =
    useContentStore();

  const { data: courses = [], isLoading } = useAllCoursesMetadata();
  const deleteCourseMutation = useDeleteCourse();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: selectedCourse, isLoading: isCourseLoading } =
    useDocumentById(selectedId);

  const handleDeleteCourse = async (
    event: React.MouseEvent<HTMLButtonElement>,
    courseId: string
  ) => {
    event.stopPropagation();
    if (!courseId || isCourseLoading || deleteCourseMutation.isLoading) return;

    const shouldDelete = window.confirm('Delete this course from history?');
    if (!shouldDelete) return;

    setDeletingId(courseId);
    try {
      await deleteCourseMutation.mutateAsync(courseId);
      if (selectedId === courseId) setSelectedId(null);
    } catch (error) {
      console.error('Failed to delete course:', error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (
      !selectedId ||
      selectedCourse?.id !== selectedId ||
      !selectedCourse?.success ||
      !Array.isArray(selectedCourse.slides)
    ) {
      return;
    }

      const meta = courses.find((course) => course.id === selectedCourse.id);
      const historyItem: ContentHistory = {
        id: selectedCourse.id,
        title: selectedCourse.title,
        topic: meta?.topic ?? selectedCourse.title,
        totalSlides: selectedCourse.slides.length,
        createdAt:
          meta?.created_at ??
          meta?.createdAt ??
          new Date().toISOString(),
        slides: selectedCourse.slides,
      };
      onSelectContent(historyItem);
      setHistorySidebarOpen(false);
      setSelectedId(null);
  }, [selectedCourse, selectedId, courses, onSelectContent, setHistorySidebarOpen]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  if (!isHistorySidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={toggleHistorySidebar}
      />
      <div className="fixed inset-y-0 left-0 z-40 w-[85vw] max-w-80 lg:relative lg:z-auto lg:w-80 h-full flex flex-col bg-secondary/50 backdrop-blur-sm border-r border-muted/30 flex-shrink-0 transition-all duration-300">
        {/* Header */}
        <div className="p-4 border-b border-muted/30 flex items-center justify-between bg-secondary/70">
          <h2 className="text-lg font-bold text-foreground">History</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHistorySidebar}
            className="h-8 w-8 p-0 hover:bg-muted/20"
          >
            <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* Current session */}
          {currentContent && (
            <div className="mb-6 animate-in slide-in-from-left-2 duration-300">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Current Session
              </h3>
              <Card className="p-4 border-primary/30 bg-primary/10 shadow-sm backdrop-blur-sm">
                <h4 className="font-semibold text-primary line-clamp-2 mb-1">
                  {currentContent.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-primary/80">
                  <FileText className="w-3 h-3" />
                  <span>{currentContent.slideCount} Slides</span>
                </div>
              </Card>
            </div>
          )}

          {/* History from API */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Previous Content
              </h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground/50">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Loading history…</span>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground/50">
                <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No history yet.</p>
                <p className="text-xs">Generate content to save it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((content) => {
                  const isThisLoading = selectedId === content.id && isCourseLoading;
                  const isDeletingThis = deletingId === content.id;
                  return (
                    <div
                      key={content.id}
                      onClick={() =>
                        !isCourseLoading &&
                        !deleteCourseMutation.isLoading &&
                        setSelectedId(content.id)
                      }
                      className={`group relative bg-muted/10 rounded-xl p-3 border border-muted/30 shadow-sm hover:shadow-md hover:border-primary/40 hover:bg-muted/20 transition-all backdrop-blur-sm ${
                        isCourseLoading || deleteCourseMutation.isLoading
                          ? 'cursor-wait opacity-60'
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground line-clamp-2 pr-2">
                          {content.title ?? content.topic ?? content.id}
                        </h4>
                        <div className="flex items-center gap-1">
                          {isThisLoading && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(event) => handleDeleteCourse(event, content.id)}
                            disabled={isDeletingThis}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            aria-label={`Delete course ${content.title ?? content.id}`}
                          >
                            {isDeletingThis ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-1 pt-1 border-t border-muted/20">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDate(
                            content.created_at ??
                              content.createdAt ??
                              new Date().toISOString()
                          )}
                        </span>
                      </div>
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
