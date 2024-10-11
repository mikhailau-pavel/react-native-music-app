import ActivityKit
import SwiftUI
import WidgetKit

import ActivityKit
import SwiftUI
import WidgetKit

struct FizlActivityView: View {
    let context: ActivityViewContext<FizlAttributes>
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack {
            VStack(spacing: 10) {
                HStack {
                    Text(context.state.headline)
                        .font(.headline)
                    Spacer()
                }
                .padding(.top)

                HStack {
                    Text(context.state.title)
                        .font(.title2)
                        .padding(.top, 5)
                    Spacer()
                }

                HStack(spacing: 20) {
                    Button(action: {
                    }) {
                        Image(systemName: "backward.fill")
                    }

                    Button(action: {
                    }) {
                        Image(systemName: 
                        // context.state.isPlaying ? "pause.fill" : 
                        "play.fill")
                    }

                    Button(action: {
                    }) {
                        Image(systemName: "forward.fill")
                    }
                }
                .font(.title2)

                Spacer()

                ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: false)
                    .progressViewStyle(LinearProgressViewStyle())

                Spacer()
            }
            .padding(.horizontal)

            Image("SmallListing")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .cornerRadius(10)
                .frame(width: 100)
                .padding()
        }
    }
}


struct FizlIslandBottom: View {
    let context: ActivityViewContext<FizlAttributes>

    var body: some View {
        VStack {
            HStack {
                VStack(spacing: 10) {
                    Spacer()

                    Text(context.state.title)
                        .font(.title3)

                    ProgressView(timerInterval: context.state.startTime...context.state.endTime, countsDown: false)
                        .progressViewStyle(LinearProgressViewStyle())

                    Spacer()
                }
                .padding(.horizontal)

                Image("SmallListing")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .cornerRadius(10)
                    .frame(width: 100)
            }
        }
    }
}

struct FizlWidget: Widget {
  let kind: String = "Fizl_Widget"
  
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: FizlAttributes.self) { context in
      FizlActivityView(context: context)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Text("Title")
        }
        DynamicIslandExpandedRegion(.trailing) {
          Text("Artist")
        }
        DynamicIslandExpandedRegion(.bottom) {
          HStack(spacing: 20) {
            Button(action: {
            }) {
              Image(systemName: "backward.fill")
            }
            
            Button(action: {
            }) {
              Image(systemName: "play.fill")
            }
            
            Button(action: {
            }) {
              Image(systemName: "forward.fill")
            }
          }
          .font(.title2)
        }
      } compactLeading: {
        Text("CL")
      } compactTrailing: {
        Text("CT")
      } minimal: {
        Text("M")
      }
      .widgetURL(URL(string: context.state.widgetUrl))
    }
  }
}

private extension FizlAttributes {
    static var preview: FizlAttributes {
        FizlAttributes()
    }
}

private extension FizlAttributes.ContentState {
    static var state: FizlAttributes.ContentState {
        FizlAttributes.ContentState(startTime: Date(timeIntervalSince1970: TimeInterval(1704300710)), endTime: Date(timeIntervalSince1970: TimeInterval(1704304310)), title: "Title", headline: "Artist", widgetUrl: "musicapp://home")
    }
}

struct FizlActivityView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .content)
                .previewDisplayName("Content View")

            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .dynamicIsland(.compact))
                .previewDisplayName("Dynamic Island Compact")

            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .dynamicIsland(.expanded))
                .previewDisplayName("Dynamic Island Expanded")

            FizlAttributes.preview
                .previewContext(FizlAttributes.ContentState.state, viewKind: .dynamicIsland(.minimal))
                .previewDisplayName("Dynamic Island Minimal")
        }
    }
}
