import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFollowers, getUserFollowing, followUser, unfollowUser } from "@/services/follows";
import { useAuth } from "@/providers/AuthProvider";

export const useProfileActions = (profileId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: followers } = useQuery({
    queryKey: ['followers', profileId],
    queryFn: () => getUserFollowers(profileId),
    enabled: !!profileId && (user?.id !== profileId)
  })

  const { data: following } = useQuery({
    queryKey: ['following', profileId],
    queryFn: () => getUserFollowing(profileId),
    enabled: !!profileId && (user?.id !== profileId)
  })

  const { mutateAsync: follow } = useMutation({
    mutationFn: () => followUser(user?.id!, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      queryClient.invalidateQueries({ queryKey: ['followers', profileId] });
      queryClient.invalidateQueries({ queryKey: ['following', user?.id] });
    }
  })

  const { mutateAsync: unfollow } = useMutation({
    mutationFn: () => unfollowUser(user?.id!, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] })
      queryClient.invalidateQueries({ queryKey: ['followers', profileId] });
      queryClient.invalidateQueries({ queryKey: ['following', user?.id] });
    }
  })

  const isFollowing = followers?.some(following => following.follower_id === user?.id);

  return {
    followers,
    following,
    isFollowing,
    follow,
    unfollow,
  };
}; 