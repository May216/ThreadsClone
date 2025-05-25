import { Image } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const downloadImage = (bucket: string, path: string, transform: { width: number, height: number } | undefined): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path, { transform })
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

interface SupabaseImageProps {
  bucket: string;
  path: string;
  className: string;
  transform: { width: number, height: number } | undefined
}

export const SupabaseImage = ({ bucket, path, className, transform }: SupabaseImageProps) => {
  const { data } = useQuery({
    queryKey: ['supabaseImage', { bucket, path, transform }],
    queryFn: () => downloadImage(bucket, path, transform),
    staleTime: 1000 * 60 * 60 * 24,
  })

  return (
    <Image
      source={{ uri: data || undefined }}
      className={`${className} bg-neutral-900`}
    />
  )
}

