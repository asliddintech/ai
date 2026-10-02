import { compileScenePrompt } from './promptCompiler';

export function exportProjectAsJSON(project) {
  return JSON.stringify(project, null, 2);
}

export function exportProjectAsMarkdown(project) {
  let md = `# ${project.title}\n\n`;
  md += `**Target Model:** ${project.model?.toUpperCase() || 'VEO'}\n`;
  md += `**Duration:** ${project.duration}\n`;
  md += `**Aspect Ratio:** ${project.aspectRatio}\n`;
  md += `**Style:** ${project.style}\n\n`;

  if (project.concept) {
    md += `## Creative Concept\n`;
    md += `**Logline:** ${project.concept.logline || ''}\n\n`;
    md += `**Visual Direction:** ${project.concept.visualDirection || ''}\n\n`;
    md += `**Mood:** ${project.concept.mood || ''}\n\n`;
  }

  if (project.storyStructure && project.storyStructure.length > 0) {
    md += `## Story Structure\n`;
    project.storyStructure.forEach(item => {
      md += `- **${item.act}** (${item.timecode}): ${item.beat}\n`;
    });
    md += `\n`;
  }

  md += `## Scene Breakdown & Video Prompts\n\n`;
  project.scenes?.forEach((scene, i) => {
    const prompt = scene.prompt || compileScenePrompt(scene, project.model);
    md += `### SCENE ${String(i + 1).padStart(2, '0')}: ${scene.title} (${scene.startTime} — ${scene.endTime})\n`;
    md += `**Action:** ${scene.description}\n\n`;
    md += `- **Subject:** ${scene.subject}\n`;
    md += `- **Environment:** ${scene.environment}\n`;
    md += `- **Camera:** ${scene.camera}\n`;
    md += `- **Lens:** ${scene.lens}\n`;
    md += `- **Composition:** ${scene.composition}\n`;
    md += `- **Lighting:** ${scene.lighting}\n`;
    md += `- **Color:** ${scene.color}\n`;
    md += `- **Motion:** ${scene.motion}\n`;
    md += `- **Atmosphere:** ${scene.atmosphere}\n`;
    md += `- **Audio Direction:** ${scene.audio}\n\n`;
    md += `**FINAL OPTIMIZED PROMPT:**\n\`\`\`\n${prompt}\n\`\`\`\n\n`;
    if (scene.negativePrompt) {
      md += `**NEGATIVE PROMPT:**\n\`\`\`\n${scene.negativePrompt}\n\`\`\`\n\n`;
    }
    md += `---\n\n`;
  });

  return md;
}

export function exportPromptsOnly(project) {
  let text = `// AI VIDEO PROMPTS: ${project.title} (${project.model?.toUpperCase() || 'VEO'})\n\n`;
  project.scenes?.forEach((scene, i) => {
    const prompt = scene.prompt || compileScenePrompt(scene, project.model);
    text += `[SCENE ${i + 1}: ${scene.title.toUpperCase()} | ${scene.startTime}-${scene.endTime}]\n`;
    text += `${prompt}\n\n`;
  });
  return text;
}

export function exportProjectAsCSV(project) {
  const headers = ['Scene', 'Timecode', 'Title', 'Subject', 'Camera', 'Lens', 'Lighting', 'Prompt'];
  const rows = project.scenes?.map((s, i) => [
    `Scene ${i + 1}`,
    `"${s.startTime}-${s.endTime}"`,
    `"${(s.title || '').replace(/"/g, '""')}"`,
    `"${(s.subject || '').replace(/"/g, '""')}"`,
    `"${(s.camera || '').replace(/"/g, '""')}"`,
    `"${(s.lens || '').replace(/"/g, '""')}"`,
    `"${(s.lighting || '').replace(/"/g, '""')}"`,
    `"${(s.prompt || compileScenePrompt(s, project.model)).replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...(rows || []).map(r => r.join(','))].join('\n');
}
