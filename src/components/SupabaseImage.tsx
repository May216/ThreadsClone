import { ActivityIndicator, Image, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const downloadImage = (bucket: string, path: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage.from(bucket).download(path)
    if (error) {
      return reject(error)
    }
    const fr = new FileReader()
    fr.readAsDataURL(data)
    fr.onload = () => {
      resolve(fr.result as string)
    }
  })
}

export const SupabaseImage = ({ bucket, path, className }: { bucket: string, path: string, className: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['supabaseImage', path],
    queryFn: () => downloadImage(bucket, path),
    staleTime: 1000 * 60 * 60 * 24,
  })

  if (isLoading) return <ActivityIndicator />
  if (error) return <Text className="text-white">Error</Text>

  return (
    <Image
      source={{ uri: data || undefined }}
      className={`${className} bg-neutral-900`}
    />
  )
}

