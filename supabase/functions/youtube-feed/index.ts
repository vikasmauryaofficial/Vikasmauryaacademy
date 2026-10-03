import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface YouTubeVideo {
  videoId: string;
  title: string;
  publishedDate: string;
  channel: "VMA" | "VCS";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await supabase
      .from("site_settings")
      .select("vma_channel_id, vcs_channel_id")
      .eq("id", 1)
      .maybeSingle();

    const vmaChannelId = settings?.vma_channel_id || "UCf7mlPgA3jG5r0t8u7NyRPg";
    const vcsChannelId = settings?.vcs_channel_id || "UCrrr6PjNuPDAd_Yo0hwv73Q";

    const url = new URL(req.url);
    const channel = url.searchParams.get("channel");
    const maxResults = parseInt(url.searchParams.get("max") || "8");

    const channels: { id: string; name: "VMA" | "VCS" }[] = [];
    if (channel === "VMA" || !channel) channels.push({ id: vmaChannelId, name: "VMA" });
    if (channel === "VCS" || !channel) channels.push({ id: vcsChannelId, name: "VCS" });

    const allVideos: YouTubeVideo[] = [];

    for (const ch of channels) {
      const maxPerChannel = channel ? maxResults : Math.ceil(maxResults / 2);
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`;

      try {
        const resp = await fetch(rssUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!resp.ok) continue;

        const xml = await resp.text();

        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;
        let count = 0;
        while ((match = entryRegex.exec(xml)) !== null && count < maxPerChannel) {
          const entry = match[1];
          const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
          const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

          if (videoIdMatch && titleMatch) {
            allVideos.push({
              videoId: videoIdMatch[1],
              title: titleMatch[1],
              publishedDate: publishedMatch ? publishedMatch[1] : "",
              channel: ch.name,
            });
            count++;
          }
        }
      } catch (err) {
        console.error(`Failed to fetch RSS for ${ch.name}:`, err.message);
      }
    }

    allVideos.sort((a, b) => {
      if (!a.publishedDate) return 1;
      if (!b.publishedDate) return -1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    return new Response(
      JSON.stringify({ videos: allVideos }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, videos: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
