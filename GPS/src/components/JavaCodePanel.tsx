import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Download, FileCode, FileText, Copy, Check } from 'lucide-react';
import { javaFiles } from '@/lib/javaCode';

export const JavaCodePanel: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  
  const fileList = Object.keys(javaFiles).filter(f => f !== 'README.md');
  const [selectedFile, setSelectedFile] = useState(fileList[0]);

  const handleCopy = async (fileName: string) => {
    const content = javaFiles[fileName as keyof typeof javaFiles];
    await navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadFile = (fileName: string) => {
    const content = javaFiles[fileName as keyof typeof javaFiles];
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Create a simple download for each file
    Object.entries(javaFiles).forEach(([fileName, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" />
            Java Implementation
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            className="h-8"
          >
            <Download className="w-3 h-3 mr-1" />
            Download All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="code" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="code" className="text-xs">
              <FileCode className="w-3 h-3 mr-1" />
              Source Code
            </TabsTrigger>
            <TabsTrigger value="readme" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              README
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="flex-1 flex flex-col min-h-0 mt-0">
            <div className="flex flex-wrap gap-1 mb-3">
              {fileList.map((file) => (
                <Button
                  key={file}
                  variant={selectedFile === file ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFile(file)}
                  className="h-7 text-xs"
                >
                  {file.replace('.java', '')}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {selectedFile}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(selectedFile)}
                  className="h-7 px-2"
                >
                  {copiedFile === selectedFile ? (
                    <Check className="w-3 h-3 text-accent" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="h-7 px-2"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 rounded-lg border border-border bg-secondary/30">
              <pre className="p-4 text-xs font-mono text-foreground/90 leading-relaxed">
                {javaFiles[selectedFile as keyof typeof javaFiles]}
              </pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="readme" className="flex-1 min-h-0 mt-0">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                README.md
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('README.md')}
                  className="h-7 px-2"
                >
                  {copiedFile === 'README.md' ? (
                    <Check className="w-3 h-3 text-accent" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadFile('README.md')}
                  className="h-7 px-2"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[400px] rounded-lg border border-border bg-secondary/30">
              <pre className="p-4 text-xs font-mono text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {javaFiles['README.md']}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
