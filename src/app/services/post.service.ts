import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Post } from './post.model';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/posts/' + id); // to be checked
  }

  addPost(content: string, image: File) {
    const postData = new FormData();
    postData.append('content', content);
    postData.append('image', image);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/posts',          // to be checked
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);       // to be checked
      });
  }

  // updatePost(id: string, title: string, content: string, image: File | string) {
  //   let postData: Post | FormData;
  //   if (typeof image === 'object') {
  //     postData = new FormData();
  //     postData.append('id', id);
  //     postData.append('content', content);
  //     postData.append('image', image, title);
  //   } else {
  //     postData = {
  //       id: id,
  //       content: content,
  //       imagePath: image,
  //       creator: null,
  //     };
  //   }
  //   this.http
  //     .put('http://localhost:3000/api/posts/' + id, postData)
  //     .subscribe((response) => {
  //       this.router.navigate(['/']);
  //     });
  // }

  // deletePost(postId: string) {
  //   return this.http.delete('http://localhost:3000/api/posts/' + postId);
  // }
}
