import { Component, OnInit } from "@angular/core";
import { UnhealthyService } from "src/app/services/admin/unhealthy.service";
import { Observable } from "rxjs";
import { UnhealthyWord } from "./unhealthyWord";
import { ChildParentCommunicationProtocol } from "src/app/shared/child-parent-communication-protocol";

@Component({
  selector: "app-unhealthy-words-list",
  templateUrl: "./unhealthy-words-list.component.html",
  styleUrls: ["./unhealthy-words-list.component.css"],
})
export class UnhealthyWordsListComponent implements OnInit {
  unhealthyWords: UnhealthyWord[];

  constructor(private unhealthyService: UnhealthyService) {}

  ngOnInit(): void {
    this.unhealthyService.getUnhealthyWords().subscribe(
      (data: UnhealthyWord[]) => (this.unhealthyWords = data),
      (error) => console.log(error)
    );
  }

  onAddWord(event: ChildParentCommunicationProtocol<UnhealthyWord>) {
    // if status is -1, error message. If status is 1, add word to unhealthyWords and display success
    if (event.status === 1) {
      this.unhealthyWords.push(event.payload);
    } else {
      console.log("onAddWord: ", event);
    }
  }
}
