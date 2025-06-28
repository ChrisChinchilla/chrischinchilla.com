import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = './src/content/posts';

function extractFirstParagraph(content) {
  // Remove frontmatter and get just the content
  const lines = content.split('\n');
  
  // Find the first non-empty line that's not a heading or special markdown
  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines, headings, and markdown metadata
    if (line === '' || 
        line.startsWith('#') || 
        line.startsWith('---') || 
        line.startsWith('import') ||
        line.startsWith('export')) {
      continue;
    }
    
    // Clean up markdown formatting for summary
    const cleanLine = line
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
      .replace(/`(.*?)`/g, '$1')       // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .trim();
    
    if (cleanLine.length > 20) { // Ensure it's substantial
      return cleanLine;
    }
  }
  
  return null;
}

function getAllMarkdownFiles(dir) {
  let results = [];
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        results = results.concat(getAllMarkdownFiles(filepath));
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        // Add markdown files to results
        results.push(filepath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return results;
}

function processPostFiles() {
  try {
    console.log(`Scanning ${postsDirectory} and all subdirectories...`);
    const markdownFiles = getAllMarkdownFiles(postsDirectory);
    
    console.log(`Found ${markdownFiles.length} post files to process...`);
    
    for (const filepath of markdownFiles) {
      const fileContent = fs.readFileSync(filepath, 'utf8');
      const relativePath = path.relative(postsDirectory, filepath);
      
      // Parse the frontmatter and content
      const { data, content } = matter(fileContent);
      
      // Skip if summary already exists
      if (data.summary) {
        console.log(`Skipping ${relativePath} - summary already exists`);
        continue;
      }
      
      // Extract first paragraph
      const summary = extractFirstParagraph(content);
      
      if (summary) {
        // Add summary to frontmatter
        data.summary = summary;
        
        // Reconstruct the file with updated frontmatter
        const updatedContent = matter.stringify(content, data);
        
        // Write back to file
        fs.writeFileSync(filepath, updatedContent);
        console.log(`✓ Added summary to ${relativePath}`);
        console.log(`  Summary: ${summary.substring(0, 80)}...`);
      } else {
        console.log(`⚠ Could not extract summary from ${relativePath}`);
      }
    }
    
    console.log('Done processing all files!');
    
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processPostFiles();