import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useImageLibrary } from '@/hooks/useImageLibrary';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImagePlus, Upload, X } from 'lucide-react';

export const ImageLibraryTab = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const imageMutation = useImageLibrary();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !description.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide an image file and a description.",
        variant: "destructive"
      });
      return;
    }

    // Convert comma-separated string to array
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description.trim());
    formData.append('tags', JSON.stringify(tagsArray));

    try {
      await imageMutation.mutateAsync(formData);

      toast({
        title: "Success",
        description: "Image has been added to the library.",
      });

      // Reset Form
      setFile(null);
      setPreviewUrl(null);
      setDescription('');
      setTags('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add image to library.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-muted/40 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-primary" />
          Add to Image Library
        </CardTitle>
        <CardDescription>
          Store educational diagrams or photos in the database for use in learning content.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Image File</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/30'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {previewUrl ? (
                <div className="relative group w-full flex justify-center">
                  <img src={previewUrl} alt="Preview" className="max-h-48 rounded-md object-contain shadow-sm" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">Click to upload image</p>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe what this image shows..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <Input placeholder="science, biology, plants" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={imageMutation.isLoading}>
            {imageMutation.isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Add Image to Library
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};